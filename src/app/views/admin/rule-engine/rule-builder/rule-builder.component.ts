/**
 * Rule Builder encaptulates te Query Builder to build the Rule.
 * It also configures the Query Builder as per the Rule Builder needs.
 *    - Maps the Payloads to Entities of the Query Builder
 *    - Maps Payload attributes to Fields
 *    - Customize the Operators
 */
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { QueryBuilderConfig, Field, RuleSet, Rule } from './query-builder';
import { Payload, CompiledCode, VariableMeta, VariableMetaMap, ValueMeta } from '../models/rule-builder.interace';
import { RuleModel } from '../models/rule.model';
import { FieldChangedEvent } from './query-builder/components';

@Component({
  moduleId: module.id,
  selector: 'app-rule-builder',
  templateUrl: './rule-builder.component.html',
  styleUrls: ['./rule-builder.component.scss']
})
export class RuleBuilderComponent implements OnChanges {
  @Input() payload: Payload;
  @Input() rule: RuleModel;
  @Input() disabled: boolean;

  @Output('datapint-changed') datapointChanged: EventEmitter<any> = new EventEmitter();

  queryCtrl: FormControl;
  query: RuleSet = RuleBuilderComponent.getEmptyRuleSet();
  selectedTab = 'builder';

  compiledQueryParsed: any = null;

  config: QueryBuilderConfig = { fields: {} } as QueryBuilderConfig;

  static getEmptyRuleSet(): RuleSet {
    const emptyRule: RuleSet = {
      condition: 'and',
      rules: []
    } as RuleSet;

    return emptyRule;
  }

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.queryCtrl = this.formBuilder.control(this.query);
  }

  ngOnInit(): void {
  }

  /**
   * Ensures that config is updated based on the payload change
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.payload) {
      this.initializeConfig();
      this.initalizeQuery();
    }
  }


  /**
   * Initalizes the entityConfig and config with payloadtype and the datapoints
   */
  initializeConfig() {
    this.config = {} as QueryBuilderConfig;
    this.config.fields = {};
    if (this.payload) {
      let datapoints = this.payload.datapoints;
      if (this.payload.assetType && this.payload.assetTypes) {
        datapoints = this.payload.assetTypes[this.payload.assetType];
      }
      if (datapoints) {
        datapoints.forEach((datapoint, index) => {
          this.config.fields[datapoint.name] = {
            name: datapoint.name,
            type: datapoint.type ? datapoint.type : 'string',
            varname: ('v' + index),
            unit: datapoint.unit,
            possibleUnits: datapoint.possibleUnits
          } as Field;
        });
      }
    }

  }

  /**
   * Initialize the query from the rule model.
   */
  initalizeQuery() {
    if (this.rule && this.rule.rawRule
        && this.rule.rawRule.ruleSet) {
      this.query = this.rule.rawRule.ruleSet as RuleSet;
      this.rule.rawRule.datapoints = {};
      this.prepareDatapoints(this.query);
      this.datapointChanged.emit(this.rule.rawRule.datapoints);
      // this.rule.rule = this.compileCodeAsString();
    } else {
      this.query = RuleBuilderComponent.getEmptyRuleSet();
    }
    this.queryCtrl = this.formBuilder.control(this.query);
  }

  prepareDatapoints(ruleSet: RuleSet) {
    if (ruleSet) {
      if (ruleSet.rules) {
        ruleSet.rules.forEach(ruleOrRuleSet => {
          if ('rules' in ruleOrRuleSet) {
            const ruleset: RuleSet = ruleOrRuleSet;
            this.prepareDatapoints(ruleset);
          } else {
            const rule: Rule = ruleOrRuleSet;
            this.addDatapoint(rule.field);
          }
        });
      }

      if (ruleSet.elseRules) {
        ruleSet.elseRules.forEach(ruleOrRuleSet => {
          if ('rules' in ruleOrRuleSet) {
            const ruleset: RuleSet = ruleOrRuleSet;
            this.prepareDatapoints(ruleset);
          } else {
            const rule: Rule = ruleOrRuleSet;
            this.addDatapoint(rule.field);
          }
        });
      }
    }
  }

  compileCodeAsString(): string {
    const compileCode: CompiledCode = this.compileCode();
    const compiledCodeAsString = JSON.stringify(compileCode);
    this.rule.rule = compiledCodeAsString;
    return compiledCodeAsString;
  }

  rawCodeAsString() : string {
    return JSON.stringify(this.query);
  }

  setRuleModel(rule:RuleModel) {
    this.rule = rule;
    this.query = rule.createCompiledRuleQuery();
    this.initializeConfig();
    this.initalizeQuery();
  }


  compileCode(): CompiledCode {
    const meta = {} as VariableMetaMap;
    const compileCode: CompiledCode = {
      meta: meta,
      code: null
    } as CompiledCode;

    compileCode.code = this.compileRuleSet(this.query, meta);

    return compileCode;
  }

  compileRuleSet(ruleSet: RuleSet, meta: VariableMetaMap): string {
    let compiledRule = '';
    if (ruleSet && ruleSet.rules) {
      compiledRule = 'if(';
      ruleSet.rules.forEach((ruleOrRuleSet: RuleSet | Rule, index: number) => {
        if ('rules' in ruleOrRuleSet) {
          const ruleset: RuleSet = ruleOrRuleSet;
          compiledRule += this.compileRuleSet(ruleset, meta);
        } else {
          const rule: Rule = ruleOrRuleSet;
          compiledRule += this.compileRule(rule, meta);
        }
        if (index !== ruleSet.rules.length - 1) {
          compiledRule += this.compileCondition(ruleSet);
        }
      });
      let compiledElseRule = 'false';
      if (ruleSet.elseRules
        && ruleSet.elseRules.length > 0
        && ruleSet.elseRules[0]
        && ruleSet.elseRules[0].rules
        && ruleSet.elseRules[0].rules.length > 0) {
        compiledElseRule = this.compileRuleSet(ruleSet.elseRules[0], meta);
      }

      compiledRule += ', true, ' + compiledElseRule + ')';
    }
    return compiledRule;
  }

  compileRule(rule: Rule, meta: VariableMetaMap): string {
    if (rule.field == null || rule.field.trim() === ''  || this.config.fields[rule.field] == null) {
      return '';
    }
    const varname = this.compileVarname(rule);
    let variableMeta: VariableMeta = meta[varname];
    if (!variableMeta) {
      variableMeta = {
        varname: varname,
        type: this.config.fields[rule.field].type,
        field: rule.field,
        values: {}
      } as VariableMeta;
      meta[varname] = variableMeta;
    }
    const valueMeta = {
      valname: this.generateValname(varname),
      value: this.compileValue(rule),
      operator: this.compileOperator(rule),
      unit: rule.unit
    } as ValueMeta;
    const threshold = this.compileThreshold(rule);
    if (threshold) {
      valueMeta.threshold = threshold;
      valueMeta.threaholdVarname = valueMeta.valname + '_T';
    }
    if (variableMeta.type === 'number') {
      valueMeta.alarmStateThreshold = this.generateAlarmThreshold(rule);
      valueMeta.normalStateThreshold = this.generateNormalThreshold(rule);
    }


    variableMeta.values[valueMeta.valname] = valueMeta;

    let compiledRule = '';
    if (rule) {
      compiledRule = this.compileExpression(variableMeta.varname, valueMeta.operator, valueMeta.valname);
    }
    return compiledRule;
  }

  compileExpression(varname: string, operator: string, valname: string) {
    let expression: string;
    switch (operator) {
      case 'contains':
      case 'like':
        expression = (operator + '(' + varname + ', ' + valname + ')');
        break;
      default:
        expression = varname + operator + valname;
        break;
    }

    return expression;
  }

  compileCondition(ruleSet: RuleSet): string {
    let condition = ruleSet.condition;
    if (condition) {
      condition = condition.toLocaleLowerCase();
    } else {
      condition = 'and';
    }
    return (condition === 'and' ? ' && ' : ' || ');
  }

  compileVarname(rule: Rule): string {
    let varname = this.config.fields[rule.field].varname;
    if (!varname) {
      varname = rule.varname;
      this.config.fields[rule.field].varname = varname;
    }
    if (!varname) {
      varname = this.generateVarname();
      rule.varname = varname;
      this.config.fields[rule.field].varname = varname;
    }

    return varname;
  }

  compileOperator(rule: Rule): string {
    let operator = ' = ';
    if (rule.operator) {
      operator = rule.operator;
    }
    return operator;
  }

  compileValue(rule: Rule): string {
    let	value = rule.value;
    if (rule.operator === 'like') {
      value = value.split('*').join('(.*)');
    }
    return value;
  }

  compileThreshold(rule: Rule): number {
    let threshold: number = null;
    if (rule.threshold && rule.threshold > 0) {
      threshold = rule.threshold;
    }
    return threshold;
  }

  generateAlarmThreshold(rule: Rule) {
    let alarmStateThreshold: any;
    if (rule.operator === '>' || rule.operator === '>=') {
      alarmStateThreshold = rule.value + rule.threshold;
    } else if (rule.operator === '<' || rule.operator === '<=') {
      alarmStateThreshold = rule.value - rule.threshold;
    } else if (rule.operator === '==' || rule.operator === '!=') {
      alarmStateThreshold = rule.value;
    }
    if (alarmStateThreshold) {
      alarmStateThreshold = Number(alarmStateThreshold.toFixed(12));
    }
    return alarmStateThreshold;
  }

  generateNormalThreshold(rule: Rule) {
    let normalStateThreshold: any;
    if (rule.operator === '>' || rule.operator === '>=') {
      normalStateThreshold = rule.value - rule.threshold;
    } else if (rule.operator === '<' || rule.operator === '<=') {
      normalStateThreshold = rule.value + rule.threshold;
    } else if (rule.operator === '==' || rule.operator === '!=') {
      normalStateThreshold = rule.value;
    }
    if (normalStateThreshold) {
      normalStateThreshold = Number(normalStateThreshold.toFixed(12));
    }
    return normalStateThreshold;
  }

  generateVarname(): string {
    let varname = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      varname += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    varname = 'v_' + varname;

    return varname;
  }

  generateValname(varname: string): string {
    let valname = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      valname += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    valname = varname + '_val_' + valname;

    return valname;
  }

  change($event) {
    console.log($event);
  }

  handleFieldChange($event: FieldChangedEvent) {
    this.removeDatapoint($event.previous);
    this.addDatapoint($event.current);
    this.datapointChanged.emit(this.rule.rawRule.datapoints);
  }

  addDatapoint(datapoint: string) {
    if (datapoint && datapoint.trim() !== '') {
      if (this.rule.rawRule.datapoints[datapoint]) {
        this.rule.rawRule.datapoints[datapoint]++;
      } else {
        this.rule.rawRule.datapoints[datapoint] = 1;
      }
    }
  }

  removeDatapoint(datapoint: string) {
    if (datapoint && datapoint.trim() !== '') {
      if (this.rule.rawRule.datapoints[datapoint]) {
        this.rule.rawRule.datapoints[datapoint]--;
        if (this.rule.rawRule.datapoints[datapoint] <= 0) {
          delete this.rule.rawRule.datapoints[datapoint];
        }
      }
    }
  }

  onTab(tab: string) {
    this.selectedTab = tab;
    if (tab === 'raw') {
      setTimeout(() => {
        this.rule.rule = this.compileCodeAsString();
        this.compiledQueryParsed = JSON.parse(this.rule.rule);
      });
    }
  }

}
