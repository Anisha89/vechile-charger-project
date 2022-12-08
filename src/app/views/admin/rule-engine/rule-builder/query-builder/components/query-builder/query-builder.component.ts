import {
    AbstractControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
    ValidationErrors,
    Validator
} from '@angular/forms';

import { QueryOperatorDirective } from './query-operator.directive';
import { QueryUnitDirective } from './query-unit.directive';
import { QueryThresholdDirective } from './query-threshold.directive';
import { QueryFieldDirective } from './query-field.directive';
import { QueryEntityDirective } from './query-entity.directive';
import { QuerySwitchGroupDirective } from './query-switch-group.directive';
import { QueryButtonGroupDirective } from './query-button-group.directive';
import { QueryInputDirective } from './query-input.directive';
import { QueryRemoveButtonDirective } from './query-remove-button.directive';
import { QueryEmptyWarningDirective } from './query-empty-warning.directive';
import {
    ButtonGroupContext,
    Field,
    SwitchGroupContext,
    EntityContext,
    FieldContext,
    InputContext,
    LocalRuleMeta,
    OperatorContext,
    Option,
    QueryBuilderClassNames,
    QueryBuilderConfig,
    RemoveButtonContext,
    Rule,
    RuleSet,
    EmptyWarningContext,
    UnitContext,
    FieldChangedEvent,
} from './query-builder.interfaces';
import {
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    forwardRef,
    Input,
    OnChanges,
    OnInit,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ElementRef,
    ViewChild,
    AfterViewInit,
    Output,
    EventEmitter
} from '@angular/core';
import { Entity } from '../index';
import { QueryBuilderContext } from './query-builder.context';
import { ThrowStmt } from '@angular/compiler';

export const CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QueryBuilderComponent),
  multi: true
};

export const VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => QueryBuilderComponent),
  multi: true
};

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR, VALIDATOR]
})
export class QueryBuilderComponent implements OnInit, OnChanges, ControlValueAccessor, Validator, AfterViewInit {
  public fields: Field[];
  public filterFields: Field[];
  public entities: Entity[];
  fieldsSetting: any;
  public defaultClassNames: QueryBuilderClassNames = {
    removeIcon: 'q-icon q-remove-icon',
    addIcon: 'q-icon q-add-icon',
    button: 'q-button',
    buttonGroup: 'q-button-group',
    removeButton: 'q-remove-button',
    switchGroup: 'q-switch-group',
    switchLabel: 'q-switch-label',
    switchRadio: 'q-switch-radio',
    rightAlign: 'q-right-align',
    transition: 'q-transition',
    tree: 'q-tree',
    row: 'q-row',
    connector: 'q-connector',
    rule: 'q-rule',
    ruleSet: 'q-ruleset',
    invalidRuleSet: 'q-invalid-ruleset',
    emptyWarning: 'q-empty-warning',
    fieldControl: 'q-field-control',
    fieldControlSize: 'q-control-size q-data-field-control-size',
    entityControl: 'q-entity-control',
    entityControlSize: 'q-control-size',
    operatorControl: 'q-operator-control',
    operatorControlSize: 'q-control-size',
    unitControl: 'q-unit-control',
    unitControlSize: 'q-control-size',
    thresholdControl: 'q-unit-control',
    thresholdControlSize: 'q-control-size',
    inputControl: 'q-input-control',
    inputControlSize: 'q-control-size',
    error: 'highlight-error',
    and: 'q-switch-and-selected',
    or: 'q-switch-or-selected',
    disabled: 'disabled',
    noCondition: 'padding-left-none',
    valueSelected: 'value-selected'
  };

  public operatorAndTextMap: {[key: string]: string } =
  {
    '==': 'equal to',
    '!=': 'not equal to',
    'contains':  'contains',
    'like': 'like',
    '>': 'greater than',
    '>=': 'greater than or equal to',
    '<': 'less than',
    '<=': 'less than or equal to',
    'in': 'in',
    'not in': 'not in',
  }

  public defaultOperatorMap: {[key: string]: string[]} = {
    string: ['==', '!=', 'contains', 'like'],
    number: ['==', '!=', '>', '>=', '<', '<='],
    time: ['==', '!=', '>', '>=', '<', '<='],
    date: ['==', '!=', '>', '>=', '<', '<='],
    category: ['==', '!=', 'in', 'not in'],
    boolean: ['==']
  };

  @Input() disabled: boolean;
  @Input() data: RuleSet = { condition: 'and', rules: [] };

  // For ControlValueAccessor interface
  public onChangeCallback: () => void;
  public onTouchedCallback: () => any;

  @Input() allowRuleset = true;
  @Input() emptyMessage = 'A ruleset cannot be empty. Please add a rule or remove it all together.';
  @Input() classNames: QueryBuilderClassNames;
  @Input() operatorMap: {[key: string]: string[]};
  @Input() parentValue: RuleSet;
  @Input() config: QueryBuilderConfig = { fields: {} };
  @Input() parentInputTemplates: QueryList<QueryInputDirective>;
  @Input() parentOperatorTemplate: QueryOperatorDirective;
  @Input() parentUnitTemplate: QueryUnitDirective;
  @Input() parentThresholdTemplate: QueryThresholdDirective;
  @Input() parentFieldTemplate: QueryFieldDirective;
  @Input() parentEntityTemplate: QueryEntityDirective;
  @Input() parentSwitchGroupTemplate: QuerySwitchGroupDirective;
  @Input() parentButtonGroupTemplate: QueryButtonGroupDirective;
  @Input() parentRemoveButtonTemplate: QueryRemoveButtonDirective;
  @Input() parentEmptyWarningTemplate: QueryEmptyWarningDirective;
  @Input() parentChangeCallback: () => void;
  @Input() parentTouchedCallback: () => void;
  @Input() elseBlock = false;
  @Input() queryBuilderInstanceNumber = 0;

  @Output() fieldChanged: EventEmitter<any> = new EventEmitter();

  @ContentChild(QueryButtonGroupDirective) buttonGroupTemplate: QueryButtonGroupDirective;
  @ContentChild(QuerySwitchGroupDirective) switchGroupTemplate: QuerySwitchGroupDirective;
  @ContentChild(QueryFieldDirective) fieldTemplate: QueryFieldDirective;
  @ContentChild(QueryEntityDirective) entityTemplate: QueryEntityDirective;
  @ContentChild(QueryOperatorDirective) operatorTemplate: QueryOperatorDirective;
  @ContentChild(QueryUnitDirective) unitTemplate: QueryUnitDirective;
  @ContentChild(QueryThresholdDirective) thresholdTemplate: QueryThresholdDirective;
  @ContentChild(QueryRemoveButtonDirective) removeButtonTemplate: QueryRemoveButtonDirective;
  @ContentChild(QueryEmptyWarningDirective) emptyWarningTemplate: QueryEmptyWarningDirective;
  @ContentChildren(QueryInputDirective) inputTemplates: QueryList<QueryInputDirective>;

  @ViewChild('queryBuilderConditions') queryBuilderConditions: ElementRef<any>;
  queryBulderConditionsWidth = 0;
  fieldWidth = 0;
  operatorWidth = 0;
  valueWidth = 0;
  unitWidth = 0;
  thresholdWidth = 0;
  lastSelectedAction = 'Add Condition';
  autocompleteNeeded = false;
  showFieldDropdown: boolean[] = [];
  displayActionDropdown = false;
  isActionDropdownOpen = false;
  // Workaround to know at the moment which dropdown is active
  // ruleIndex is the index of rule for which the dropdown is active
  // dropdownIndex shows which dropdown is active (FieldDropdown = 1, OperatorDropodwn = 2, Unit Dropdown = 3)
  ruleActiveDropdown = {
    ruleIndex: -1,
    dropdownIndex: -1
  };
  conditionSwitchNeeded = false;

  private defaultTemplateTypes: string[] = [
    'string', 'number', 'time', 'date', 'category', 'boolean', 'multiselect'];
  private defaultEmptyList: any[] = [];
  private operatorsCache: {[key: string]: string[]};
  private inputContextCache = new Map<Rule, InputContext>();
  private operatorContextCache = new Map<Rule, OperatorContext>();
  private unitContextCache = new Map<Rule, UnitContext>();
  private fieldContextCache = new Map<Rule, FieldContext>();
  private entityContextCache = new Map<Rule, EntityContext>();
  private removeButtonContextCache = new Map<Rule, RemoveButtonContext>();
  private buttonGroupContext: ButtonGroupContext;

  constructor(private changeDetectorRef: ChangeDetectorRef, private context: QueryBuilderContext) {
  }
  // ----------OnInit Implementation----------

  ngOnInit() {
    this.setShowExtraByDefault();
  }

  ngAfterViewInit() {
    this.calculateWidths();
  }


  setShowExtraByDefault() {
    if (this.data && this.data.rules) {
      for (const rule of this.data.rules) {
        if ('threshold' in rule) {
          if (rule.threshold > 0) {
            rule.showExtra = true;
          } else {
            rule.showExtra = false;
          }
        }
      }
    }
  }

  // ----------OnChanges Implementation----------

  ngOnChanges(changes: SimpleChanges) {
    this.setFieldsDropdownSettings();
    this.setShowExtraByDefault();
    const config = this.config;
    const type = typeof config;
    if (type === 'object') {
      this.fields = Object.keys(config.fields).map((value) => {
        const field = config.fields[value];
        field.value = field.value || value;
        return field;
      });
      if (config.entities) {
        this.entities = Object.keys(config.entities).map((value) => {
          const entity = config.entities[value];
          entity.value = entity.value || value;
          return entity;
        });
      } else {
        this.entities = null;
      }
      this.operatorsCache = {};
      this.setRuleFieldForDropdown();
    } else {
      throw new Error(`Expected 'config' must be a valid object, got ${type} instead.`);
    }
  }

  setRuleFieldForDropdown() {
    if (this.data && this.data.rules) {
      for (const rule of this.data.rules) {
        if ('field' in rule) {
          if (this.fields && this.fields.length > 0) {
            if (!rule.fields || (rule.fields && rule.fields.length > 0 && !('value' in rule.fields[0]))) {
              rule.fields = [];
                const foundField = this.fields.find((fieldElement: any) => fieldElement.value === rule.field);
                if (foundField) {
                  rule.fields.push(foundField);
                }
              if (rule.field && rule.fields.length === 0) {
                const fieldObj = {
                    name: rule.field
                };
                rule.fields.push(fieldObj);
              }
            }
          }
        }

      }
    }


  }

  setFieldsDropdownSettings() {
    this.fieldsSetting = {
      // TODO : Use Translation
      text: 'Datapoint',
      classes: '',
      singleSelection: true,
      enableFilterSelectAll: false,
      enableSearchFilter: true,
      disabled: this.disabled,
      labelKey: 'name',
      primaryKey: 'name'
    };
  }


  setActiveDropdown(ruleIndex: number, dropdownIndex: number) {
    this.ruleActiveDropdown.ruleIndex = ruleIndex;
    this.ruleActiveDropdown.dropdownIndex = dropdownIndex;
    // this.showFieldDropdown = [];
    // this.showFieldDropdown[ruleIndex] = true;
  }
  hideFieldDropdown(ruleIndex: number) {
    this.showFieldDropdown[ruleIndex] = false;
    // this.showFieldDropdown = false;
  }
  // ----------Validator Implementation----------

  validate(control: AbstractControl): ValidationErrors | null {
    const errors: {[key: string]: any} = {};
    const ruleErrorStore = [];
    let hasErrors = false;

    if (!this.config.allowEmptyRulesets && this.checkEmptyRuleInRuleset(this.data)) {
      errors.empty = 'Empty rulesets are not allowed.';
      hasErrors = true;
    }

    this.validateRulesInRuleset(this.data, ruleErrorStore);

    if (ruleErrorStore.length) {
      errors.rules = ruleErrorStore;
      hasErrors = true;
    }
    return hasErrors ? errors : null;
  }

  // TODO: Review with Sarva

  toggleAutoComplete(rule: Rule) {
    this.autocompleteNeeded = !this.autocompleteNeeded;
    if (this.autocompleteNeeded) {
      this.setFocusToTextBox();
    }
  }

  showDataListInput(rule: Rule) {
    this.autocompleteNeeded = true;
  }

  clearRuleField(rule: Rule) {
    rule.field = '';
  }

  setInputValue($event: any) {
    (<HTMLInputElement>document.getElementById('datapointOptionText')).value = $event;
  }

  clearInputValue() {
    (<HTMLInputElement>document.getElementById('datapointOptionText')).value = '';
  }

  setFocusToTextBox() {
    const id = '';
    if (document.getElementById(id)) {
      document.getElementById(id).focus();
    }
  }
  // TODO Review with Sarva
  checkIsSwitchNeeded() {
    if (this.data && this.data.rules && this.data.rules.length > 1) {
      this.conditionSwitchNeeded = true;
      return true;
    } else {
      this.conditionSwitchNeeded = false;
      return false;
    }
  }

  // ----------ControlValueAccessor Implementation----------

  @Input()
  get value(): RuleSet {
    return this.data;
  }
  set value(value: RuleSet) {
    // When component is initialized without a formControl, null is passed to value
    this.data = value || { condition: 'and', rules: [] };
    this.handleDataChange();
  }

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = () => fn(this.data);
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = () => fn(this.data);
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.detectChanges();
  }

  // ----------END----------

  getDisabledState(): boolean {
    return this.disabled;
  }

  findTemplateForRule(rule: Rule): TemplateRef<any> {
    const type = this.getInputType(rule.field, rule.operator);
    if (type) {
      const queryInput = this.findQueryInput(type);
      if (queryInput) {
        return queryInput.template;
      } else {
        if (this.defaultTemplateTypes.indexOf(type) === -1) {
          console.warn(`Could not find template for field with type: ${type}`);
        }
        return null;
      }
    }
  }

  findQueryInput(type: string): QueryInputDirective {
    const templates = this.parentInputTemplates || this.inputTemplates;
    return templates.find((item) => item.queryInputType === type);
  }

  getOperators(field: string): string[] {
    if (this.operatorsCache[field]) {
      return this.operatorsCache[field];
    }
    let operators = this.defaultEmptyList;
    const fieldObject = this.config.fields[field];

    if (fieldObject == null) {
      return this.defaultOperatorMap['string'];
    }

    if (this.config.getOperators) {
      return this.config.getOperators(field, fieldObject);
    }

    const type = fieldObject.type;

    if (fieldObject && fieldObject.operators) {
      operators = fieldObject.operators;
    } else if (type) {
      operators = (this.operatorMap && this.operatorMap[type]) || this.defaultOperatorMap[type] || this.defaultEmptyList;
      if (operators.length === 0) {
        console.warn(
          `No operators found for field '${field}' with type ${fieldObject.type}. ` +
          `Please define an 'operators' property on the field or use the 'operatorMap' binding to fix this.`);
      }
      if (fieldObject.nullable) {
        operators = operators.concat(['is null', 'is not null']);
      }
    } else {
      console.warn(`No 'type' property found on field: '${field}'`);
    }

    // Cache reference to array object, so it won't be computed next time and trigger a rerender.
    this.operatorsCache[field] = operators;
    return operators;
  }

  getUnits(rule: Rule): string[] {
    if (this.unitContextCache[rule.field]) {
      return this.unitContextCache[rule.field];
    }

    const fieldObject = this.config.fields[rule.field];
    if (fieldObject == null) {
      return null;
    }
    let units = fieldObject.possibleUnits;

    if (this.config.getUnits) {
      units = this.config.getUnits(rule.field, fieldObject, rule.operator);
    }

    return units;
  }

  getFields(entity: string, rule: Rule): Field[] {
    let fields = [];
    if (this.entities && entity) {
      fields = this.fields.filter((field) => {
        return field && field.entity === entity;
      });
    } else {
      fields = this.fields;
    }
    return fields;
  }

  isValidField(entity: string, name: string): boolean {
    let fields: Field[];
    if (this.entities && entity) {
      fields = this.fields.filter((field) => {
        return field && field.entity === entity && field.name === name;
      });
    } else {
      fields = this.fields.filter((field) => {
        return field && field.name === name;
      });
    }
    return fields && fields.length > 0;
  }

  getInputType(field: string, operator: string): string {
    if (this.config.getInputType) {
      return this.config.getInputType(field, operator);
    }
    if (!(this.config.fields && this.config.fields[field])) {
      // if fields not updated yet
      return 'string';
    }
    const type = this.config.fields[field].type;
    switch (operator) {
      case 'is null':
      case 'is not null':
        return null;  // No displayed component
      case 'in':
      case 'not in':
        return type === 'category' || type === 'boolean' ? 'multiselect' : type;
      default:
        return type;
    }
  }

  isThresholdApplicable(rule: Rule) {
    const isNumber = this.getInputType(rule.field, rule.operator) === 'number';
    const validOperator = rule.operator !== '==' && rule.operator !== '!=';
    if (!validOperator) {
      rule.threshold = null;
    } else {
      rule.threshold = rule.threshold;
    }
    return isNumber && validOperator;
  }

  getOptions(field: string): Option[] {
    if (this.config.getOptions) {
      return this.config.getOptions(field);
    }
    return this.config.fields[field].options || this.defaultEmptyList;
  }

  getClassNames(...args): string {
    const clsLookup = this.classNames ? this.classNames : this.defaultClassNames;
    const classNames = args.map((id) => clsLookup[id] || this.defaultClassNames[id]).filter((c) => !!c);
    return classNames.length ? classNames.join(' ')  : null;
  }

  getDefaultField(entity: Entity): Field {
    if (!entity) {
      return null;
    } else if (entity.defaultField !== undefined) {
      return this.getDefaultValue(entity.defaultField);
    } else {
      const entityFields = this.fields.filter((field) => {
        return field && field.entity === entity.value;
      });
      if (entityFields && entityFields.length) {
        return entityFields[0];
      } else {
        console.warn(`No fields found for entity '''${entity.name}'' A ''defaultOperator'' is also not specified on the field config.` +
        ` Operator value will default to null.`);
        return null;
      }
    }
  }

  getDefaultOperator(field: Field): string {
    if (field && field.defaultOperator !== undefined) {
      return this.getDefaultValue(field.defaultOperator);
    } else {
      if (field == null) {
        return null;
      }
      const operators = this.getOperators(field.value);
      if (operators && operators.length) {
        return operators[0];
      } else {
        console.warn(`No operators found for field '''${field.name}'' A ''defaultOperator'' is also not specified on the field config.` +
        ` Operator value will default to null.`);
        return null;
      }
    }
  }

  performAction(action: string, $event?: any) {
    if ($event) {
      $event.stopPropagation();
    }
    switch (action) {
      case 'Add Condition':
        this.addRule();
        break;
      case 'Add Sub Condition':
        this.addRuleSet();
        break;
      case 'Add Else Condition':
        this.toggleElseRuleSet();
        break;
      case 'Remove Else Condition':
        this.toggleElseRuleSet();
        break;
      case 'Remove Block':
        this.removeRuleSet();
        break;
    }
  }

  setDisplayActionDropdown(displayActionDropdown: boolean) {
    this.displayActionDropdown = displayActionDropdown;
    if (this.displayActionDropdown === true) {
      setTimeout(() => {
        if (this.isActionDropdownOpen === false) {
          this.displayActionDropdown = false;
        }
      }, 3000);
    }
  }

  addRule(parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }
    this.lastSelectedAction = 'Add Condition';

    parent = parent || this.data;
    if (this.config.addRule) {
      this.config.addRule(parent);
    } else {
      const rule = {
        field: '',
        operator: '==',
        value: '',
        entity: null
      }
      parent.rules = parent.rules.concat([rule]);
      this.select(rule);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  removeRule(rule: Rule, parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }

    parent = parent || this.data;
    if (this.config.removeRule) {
      this.config.removeRule(rule, parent);
    } else {
      parent.rules = parent.rules.filter((r) => r !== rule);
    }
    this.inputContextCache.delete(rule);
    this.operatorContextCache.delete(rule);
    this.fieldContextCache.delete(rule);
    this.entityContextCache.delete(rule);
    this.removeButtonContextCache.delete(rule);

    this.handleTouched();
    this.handleDataChange();
    this.raiseFieldChangedEvent(rule.field, null);
  }

  addRuleSet(parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }
    this.lastSelectedAction = 'Add Sub Condition';

    parent = parent || this.data;
    if (this.config.addRuleSet) {
      this.config.addRuleSet(parent);
    } else {
      // TODO: Review with Sarva
      const rule = {
        field: '',
        operator: '==',
        value: '',
        entity: null
      }
      const ruleSet = {condition: 'and', rules: [rule]};
      parent.rules = parent.rules.concat([ruleSet]);
      this.select(ruleSet);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  toggleElseRuleSet(parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }

    parent = parent || this.data;
    if (parent.elseRules) {
      parent.elseRules = null;
    } else {
      // TODO: Review with Sarva
      const rule = {
        field: '',
        operator: '==',
        value: '',
        entity: null
      }
      const ruleSet = {condition: 'and', rules: [rule]};
      parent.elseRules = [ruleSet];
      this.select(ruleSet);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  removeRuleSet(ruleset?: RuleSet, parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }

    ruleset = ruleset || this.data;
    parent = parent || this.parentValue;
    if (this.config.removeRuleSet) {
      this.config.removeRuleSet(ruleset, parent);
    } else {
      if (this.elseBlock) {
        parent.elseRules = null;
      } else {
        parent.rules = parent.rules.filter((r) => r !== ruleset);
      }
    }

    this.handleTouched();
    this.handleDataChange();
    this.raiseRuleSetRemoveEvent(ruleset);
  }

  raiseRuleSetRemoveEvent(ruleSet: RuleSet) {
    if (ruleSet) {
      if (ruleSet.rules) {
        ruleSet.rules.forEach(ruleOrRuleSet => {
          if ('rules' in ruleOrRuleSet) {
            const ruleset: RuleSet = ruleOrRuleSet;
            this.raiseRuleSetRemoveEvent(ruleset);
          } else {
            const rule: Rule = ruleOrRuleSet;
            this.raiseFieldChangedEvent(rule.field, null);
          }
        });
      }

      if (ruleSet.elseRules) {
        ruleSet.elseRules.forEach(ruleOrRuleSet => {
          if ('rules' in ruleOrRuleSet) {
            const ruleset: RuleSet = ruleOrRuleSet;
            this.raiseRuleSetRemoveEvent(ruleset);
          } else {
            const rule: Rule = ruleOrRuleSet;
            this.raiseFieldChangedEvent(rule.field, null);
          }
        });
      }
    }
  }

  changeCondition(value: string): void {
    if (this.disabled) {
      return;
    }

    this.data.condition = value;
    this.handleTouched();
    this.handleDataChange();
  }

  changeOperator(): void {
    if (this.disabled) {
      return;
    }

    this.handleTouched();
    this.handleDataChange();
  }

  restrictNegativeThreshold(evt: any) {
    evt = evt || window.event;
    const charCode = evt.code;
    if (charCode === 'Minus') {
        return false;
    }
  }

  changeThreshold(rule: Rule, $event: any): void {
    if (this.disabled) {
      return;
    }

    this.handleTouched();
    this.handleDataChange();
  }

  toggleShowExtra(rule: Rule) {
    if (rule.threshold > 0) {
      rule.showExtra = true;
    } else {
      rule.showExtra = false;
    }
    this.handleTouched();
    this.handleDataChange();
  }

  changeInput(): void {
    if (this.disabled) {
      return;
    }

    this.handleTouched();
    this.handleDataChange();
  }

  changeField(fieldValue: string, rule: Rule): void {
    const previousValue = rule.field;
    if (this.disabled) {
      return;
    }
    this.toggleAutoComplete(rule);

    if (!this.isValidField(rule.entity, fieldValue)) {
      if (previousValue) {
        rule.field = previousValue.toString();
      } else {
        rule.field = null;
      }
      return;
    }
    rule.field = fieldValue;

    const field: Field = this.config.fields[fieldValue];

    if (field && field.defaultValue !== undefined) {
      rule.value = this.getDefaultValue(field.defaultValue);
    } else {
      delete rule.value;
    }

    rule.operator = this.getDefaultOperator(field);
    rule.unit = field.unit;

    // Create new context objects so templates will automatically update
    this.inputContextCache.delete(rule);
    this.operatorContextCache.delete(rule);
    this.fieldContextCache.delete(rule);
    this.entityContextCache.delete(rule);
    this.getInputContext(rule);
    this.getFieldContext(rule);
    this.getOperatorContext(rule);
    this.getUnitContext(rule);
    this.getEntityContext(rule);

    this.handleTouched();
    this.handleDataChange();
    this.raiseFieldChangedEvent(previousValue, fieldValue);
  }

  selectField(fieldObj: any, rule: Rule) {
    const fieldValue = fieldObj.value;
    const previousValue = rule.field;
    if (this.disabled) {
      return;
    }
    rule.fields = [fieldObj];
    this.toggleAutoComplete(rule);

    if (!this.isValidField(rule.entity, fieldValue)) {
      if (previousValue) {
        rule.field = previousValue.toString();
      } else {
        rule.field = null;
      }
      return;
    }
    rule.field = fieldValue;

    const field: Field = this.config.fields[fieldValue];

    if (field && field.defaultValue !== undefined) {
      rule.value = this.getDefaultValue(field.defaultValue);
    } else {
      delete rule.value;
    }

    rule.operator = this.getDefaultOperator(field);
    rule.unit = field.unit;

    // Create new context objects so templates will automatically update
    this.inputContextCache.delete(rule);
    this.operatorContextCache.delete(rule);
    this.fieldContextCache.delete(rule);
    this.entityContextCache.delete(rule);
    this.getInputContext(rule);
    this.getFieldContext(rule);
    this.getOperatorContext(rule);
    this.getUnitContext(rule);
    this.getEntityContext(rule);

    this.handleTouched();
    this.handleDataChange();
    this.raiseFieldChangedEvent(previousValue, fieldValue);
  }

  getSelectedFields(rule: Rule) {
    const selectedFields = [];
    if (rule.field) {
      selectedFields.push(rule.field);
    }
    return selectedFields;
  }

  changeUnit(rule: Rule, unit: string) {
    rule.unit = unit;
  }

  raiseFieldChangedEvent(previous: string, current: string) {
    this.fieldChanged.emit({
      current: current,
      previous: previous
    } as FieldChangedEvent);
  }

  handleFieldChange($event: FieldChangedEvent) {
    this.fieldChanged.emit($event);
  }


  changeEntity(entityValue: string, rule: Rule): void {
    if (this.disabled) {
      return;
    }

    const entity: Entity = this.entities.find((e) => e.value === entityValue);
    const defaultField: Field = this.getDefaultField(entity);

    if (defaultField) {
      this.changeField(defaultField.value, rule);
    } else {
      this.handleTouched();
      this.handleDataChange();
    }
  }

  getDefaultValue(defaultValue: any): any {
    switch (typeof defaultValue) {
      case 'function':
        return defaultValue();
      default:
        return defaultValue;
    }
  }

  getOperatorTemplate(): TemplateRef<any> {
    const t = this.parentOperatorTemplate || this.operatorTemplate;
    return t ? t.template : null;
  }

  getUnitTemplate(): TemplateRef<any> {
    const t = this.parentUnitTemplate || this.unitTemplate;
    return t ? t.template : null;
  }

  getThresholdTemplate(): TemplateRef<any> {
    const t = this.parentThresholdTemplate || this.thresholdTemplate;
    return t ? t.template : null;
  }

  getFieldTemplate(): TemplateRef<any> {
    const t = this.parentFieldTemplate || this.fieldTemplate;
    return t ? t.template : null;
  }

  getEntityTemplate(): TemplateRef<any> {
    const t = this.parentEntityTemplate || this.entityTemplate;
    return t ? t.template : null;
  }

  getButtonGroupTemplate(): TemplateRef<any> {
    const t = this.parentButtonGroupTemplate || this.buttonGroupTemplate;
    return t ? t.template : null;
  }

  getSwitchGroupTemplate(): TemplateRef<any> {
    const t = this.parentSwitchGroupTemplate || this.switchGroupTemplate;
    return t ? t.template : null;
  }

  getRemoveButtonTemplate(): TemplateRef<any> {
    const t = this.parentRemoveButtonTemplate || this.removeButtonTemplate;
    return t ? t.template : null;
  }

  getEmptyWarningTemplate(): TemplateRef<any> {
    const t = this.parentEmptyWarningTemplate || this.emptyWarningTemplate;
    return t ? t.template : null;
  }

  getQueryItemClassName(local: LocalRuleMeta, additionalClasses?: string): string {
    let cls = this.getClassNames('row', 'connector', 'transition');
    cls += ' ' + this.getClassNames(local.ruleset ? 'ruleSet' : 'rule');
    if (local.invalid) {
      // cls += ' ' + this.getClassNames('invalidRuleSet');
    }
    if (additionalClasses) {
      cls += ' ' + additionalClasses;
    }

    // TODO review with Sarva
    if (!this.checkIsSwitchNeeded()) {
      cls += ' ' + 'switch-not-needed'
    }
    return cls;
  }

  getQueryItemElseClassName(local: LocalRuleMeta, additionalClasses?: string): string {
    let cls = this.getClassNames('row', 'else', 'transition');
    cls += ' ' + this.getClassNames(local.ruleset ? 'ruleSet' : 'rule');
    if (local.invalid) {
      // cls += ' ' + this.getClassNames('invalidRuleSet');
    }
    if (additionalClasses) {
      cls += ' ' + additionalClasses;
    }
    return 'q-else ' + cls;
  }

  getButtonGroupContext(): ButtonGroupContext {
    if (!this.buttonGroupContext) {
      this.buttonGroupContext = {
        addRule: this.addRule.bind(this),
        addRuleSet: this.allowRuleset && this.addRuleSet.bind(this),
        removeRuleSet: this.allowRuleset && this.parentValue && this.removeRuleSet.bind(this),
        getDisabledState: this.getDisabledState.bind(this),
        $implicit: this.data
      };
    }
    return this.buttonGroupContext;
  }

  getRemoveButtonContext(rule: Rule): RemoveButtonContext {
    if (!this.removeButtonContextCache.has(rule)) {
      this.removeButtonContextCache.set(rule, {
        removeRule: this.removeRule.bind(this),
        getDisabledState: this.getDisabledState.bind(this),
        $implicit: rule
      });
    }
    return this.removeButtonContextCache.get(rule);
  }

  getFieldContext(rule: Rule): FieldContext {
    if (!this.fieldContextCache.has(rule)) {
      this.fieldContextCache.set(rule, {
        onChange: this.changeField.bind(this),
        getFields: this.getFields.bind(this),
        getDisabledState: this.getDisabledState.bind(this),
        fields: this.fields,
        $implicit: rule
      });
    }
    return this.fieldContextCache.get(rule);
  }

  getEntityContext(rule: Rule): EntityContext {
    if (!this.entityContextCache.has(rule)) {
      this.entityContextCache.set(rule, {
        onChange: this.changeEntity.bind(this),
        getDisabledState: this.getDisabledState.bind(this),
        entities: this.entities,
        $implicit: rule
      });
    }
    return this.entityContextCache.get(rule);
  }

  getSwitchGroupContext(): SwitchGroupContext {
    return {
      onChange: this.changeCondition.bind(this),
      getDisabledState: this.getDisabledState.bind(this),
      $implicit: this.data
    };
  }

  getEmptyWarningContext(): EmptyWarningContext {
    return {
      getDisabledState: this.getDisabledState.bind(this),
      message: this.emptyMessage,
      $implicit: this.data
    };
  }

  getOperatorContext(rule: Rule): OperatorContext {
    if (!this.operatorContextCache.has(rule)) {
      this.operatorContextCache.set(rule, {
        onChange: this.changeOperator.bind(this),
        getDisabledState: this.getDisabledState.bind(this),
        operators: this.getOperators(rule.field),
        $implicit: rule
      });
    }
    return this.operatorContextCache.get(rule);
  }

  getUnitContext(rule: Rule): UnitContext {
    if (!this.unitContextCache.has(rule)) {
      this.unitContextCache.set(rule, {
        onChange: this.changeOperator.bind(this),
        getDisabledState: this.getDisabledState.bind(this),
        units: this.getUnits(rule),
        $implicit: rule
      });
    }
    return this.unitContextCache.get(rule);
  }

  getInputContext(rule: Rule): InputContext {
    if (!this.inputContextCache.has(rule)) {
      this.inputContextCache.set(rule, {
        onChange: this.changeInput.bind(this),
        getDisabledState: this.getDisabledState.bind(this),
        options: this.getOptions(rule.field),
        field: this.config.fields[rule.field],
        $implicit: rule
      });
    }
    return this.inputContextCache.get(rule);
  }

  private checkEmptyRuleInRuleset(ruleset: RuleSet): boolean {
    if (!ruleset || !ruleset.rules || ruleset.rules.length === 0) {
      return true;
    } else {
      return ruleset.rules.some((item: RuleSet) => {
        if (item.rules) {
          return this.checkEmptyRuleInRuleset(item);
        } else {
          return false;
        }
      });
    }
  }

  private validateRulesInRuleset(ruleset: RuleSet, errorStore: any[]) {
    if (ruleset && ruleset.rules && ruleset.rules.length > 0) {
      ruleset.rules.forEach((item) => {
        if ((item as RuleSet).rules) {
          return this.validateRulesInRuleset(item as RuleSet, errorStore);
        } else if ((item as Rule).field) {
          const field = this.config.fields[(item as Rule).field];
          if (field && field.validator && field.validator.apply) {
            const error = field.validator(item as Rule, ruleset);
            if (error != null) {
              errorStore.push(error);
            }
          }
        }
      });
    }
  }

  private handleDataChange(): void {
    this.changeDetectorRef.markForCheck();
    if (this.onChangeCallback) {
      this.onChangeCallback();
    }
    if (this.parentChangeCallback) {
      this.parentChangeCallback();
    }
  }

  private handleTouched(): void {
    if (this.onTouchedCallback) {
      this.onTouchedCallback();
    }
    if (this.parentTouchedCallback) {
      this.parentTouchedCallback();
    }
  }

  select(selection: any, $event?: any, ) {
    if ($event) {
      $event.stopPropagation();
    }
    this.context.setSelected(selection);
  }

  calculateWidths() {
    if (this.queryBuilderConditions && this.queryBuilderConditions.nativeElement) {
      this.queryBulderConditionsWidth = this.queryBuilderConditions.nativeElement.offsetWidth;

      if (this.queryBulderConditionsWidth <= 320) {
        // all 100% single line for each feild
        this.fieldWidth = 100;
        this.operatorWidth = 100;
        this.valueWidth = 100;
        this.unitWidth = 100;
        this.thresholdWidth = 100;

      } else if (this.queryBulderConditionsWidth <= 414) {
        // line 1 - field, line 2 - operator and vlaue, line 3 and 4 are unit and threshold
        this.fieldWidth = 100;
        this.operatorWidth = 100;
        this.valueWidth = 100;
        this.unitWidth = 100;
        this.thresholdWidth = 100;
      } else if (this.queryBulderConditionsWidth <= 568) {
        // line 1 - field, line 2 - operator and vlaue, line 3 - unit and threshold
        this.fieldWidth = 100;
        this.operatorWidth = 100;
        this.valueWidth = 100;
        this.unitWidth = 50;
        this.thresholdWidth = 50;
      } else if (this.queryBulderConditionsWidth <= 770) {
        // TODO: Verify with Sarva. Before it was 736. It was compact in edit rule for first condition
        // line 1 - field, operator and vlaue, line 3 - unit and threshold
        this.fieldWidth = 60;
        this.operatorWidth = 40;
        this.valueWidth = 50;
        this.unitWidth = 20;
        this.thresholdWidth = 30;
      } else {
        // are all single line
        this.fieldWidth = 35;
        this.operatorWidth = 20;
        this.valueWidth = 20;
        this.unitWidth = 10;
        this.thresholdWidth = 15;
      }
    }
  }
}
