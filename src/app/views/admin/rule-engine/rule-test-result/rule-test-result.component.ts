/**
 * Allows user to Add, Edit or View the Rule.
 */
import { Component, ViewChild, Input, EventEmitter, Output, OnChanges, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal'
import { RuleModel } from '../models/rule.model';
import { TestResult } from '../rule-tester';
import { RuleSet, Rule } from '../rule-builder/query-builder';


export const operatorAndTextMap: { [key: string]: string } = {
    '==': 'Equal To',
    '!=': 'Not Equal To',
    'contains': 'Contains',
    'like': 'Like',
    '>': 'Greater Than',
    '>=': 'Greater Than or Equal To',
    '<': 'Less Than',
    '<=': 'Less Than or Equal To',
    'in': 'In',
    'not in': 'Not In',
}



@Component({
    selector: 'app-rule-test-result',
    templateUrl: './rule-test-result.component.html',
    styleUrls: ['./rule-test-result.component.scss']
})
export class RuleTestResultComponent implements OnChanges {
    @Input() show: boolean;
    @Input() rule: RuleModel;
    @Input() testResults: TestResult[];
    @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
    displayRule: string;
    ruleMeta: any;

    @ViewChild('testResultsModal') public testResultsModal: ModalDirective;

    ruleJsonContentHeight: number;

    constructor() {
        console.log('RuleTestResultComponent  construcotr....');
    }
    ngOnChanges(): void {
        if (this.show) {
            this.testResultsModal.show();
            if (this.rule) {
                const compiledRule: any = JSON.parse(this.rule.rule);
                this.ruleMeta = compiledRule['meta'];
                this.displayRule = this.compileDisplayRuleSet(this.rule.rawRule.ruleSet);
            }
        } else {
            this.testResultsModal.hide();

        }
    }

    deleteUnwantedProperty() {
        let ruleSet;
        if (this.rule) {
            ruleSet = this.rule.rawRule.ruleSet;
        }
    }

    compileDisplayRuleSet(ruleSet: RuleSet): string {
        let compiledRule = '';
        if (ruleSet && ruleSet.rules) {
            compiledRule = 'if('
            ruleSet.rules.forEach((ruleOrRuleSet: RuleSet | Rule, index: number) => {
                if ('rules' in ruleOrRuleSet) {
                    const ruleset: RuleSet = ruleOrRuleSet;
                    compiledRule += this.compileDisplayRuleSet(ruleset);
                } else {
                    const rule: Rule = ruleOrRuleSet;
                    compiledRule += this.compileDisplayRule(rule);
                }
                if (index !== ruleSet.rules.length - 1) {
                    compiledRule += this.compileCondition(ruleSet);
                }
            });
            const normalState = 'Normal State';
            let compiledElseRule = null;
            if (ruleSet.elseRules
                && ruleSet.elseRules.length > 0
                && ruleSet.elseRules[0]
                && ruleSet.elseRules[0].rules
                && ruleSet.elseRules[0].rules.length > 0) {
                compiledElseRule = this.compileDisplayRuleSet(ruleSet.elseRules[0]);
            }
            const alarmState = 'Alarm State';
            if (compiledElseRule) {
                compiledRule += ', ' + alarmState.fontcolor('red') + ', ' + compiledElseRule + ')';

            } else {
                compiledRule += ', ' + alarmState.fontcolor('red') + ', ' + normalState.fontcolor('green') + ')';
            }
        }
        return compiledRule;
    }

    compileDisplayRule(rule: Rule): string {
        if (rule.field == null || rule.field.trim() === '') {
            return '';
        }
        const varname = rule.field;
        const operator = this.compileOperator(rule);
        const value = this.compileValue(rule);
        const unit = rule.unit
        let compiledRule = '';
        if (rule) {
            compiledRule = this.compileDisplayExpression(varname, operator, value, unit);
        }
        return compiledRule;
    }

    compileCondition(ruleSet: RuleSet): string {
        let condition = ruleSet.condition;
        if (condition) {
            condition = condition.toLocaleLowerCase();
        } else {
            condition = 'and';
        }
        const and = ' <b>AND</b> ';
        const or = ' <b>OR</b> '
        return (condition === 'and' ? and.fontcolor('#00a1cf') : or.fontcolor('#00a1cf'));
    }

    compileDisplayExpression(varname: string, operator: string, valname: string, unit: string) {
        let expression: string;
        if (!unit) {
            unit = '';
        }
        operator.fontcolor('green');
        expression = varname + ' ' + operator.fontcolor('#00a1cf') + ' \'' + (valname + ' ' + unit).trim() + '\'';
        return expression;
    }

    compileOperator(rule: Rule): string {
        let operator = ' = ';
        if (rule.operator) {
            operator = rule.operator;
        }
        return '<b>' + operatorAndTextMap[operator] + '</b>';
    }

    compileValue(rule: Rule): string {
        let value = rule.value;
        if (rule.operator === 'like') {
            value = value.split('*').join('(.*)');
        }
        return value;
    }
}
