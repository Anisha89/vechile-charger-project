import { Component, OnInit, ViewChild } from '@angular/core';
import { RuleEngineService } from '../rule-engine.service';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RuleModel } from '../models/rule.model';
import { RuleTester, TestResult } from '../rule-tester';

@Component({
    selector: 'app-rules',
    templateUrl: 'rules.component.html',
    styleUrls: ['rules.component.scss']
})
export class RulesComponent implements OnInit {
    rules: RuleModel[];
    selected: RuleModel;
    @ViewChild('deleteConfirmationModal')
    public deleteConfirmationModal: ModalDirective;
    @ViewChild('statusChangeModal')
    public statusChangeModal: ModalDirective;
    @ViewChild('publishConfirmationModal')
    public publishConfirmationModal: ModalDirective;
    testRule: RuleModel;
    assetStates: any[];
    testResults: TestResult[];
    showTestResult: boolean;
    isLoading=false;
    constructor(
        private service: RuleEngineService,
        private context: AppContext,
        protected ruleEngineSerivce: RuleEngineService,
        protected ruleTester: RuleTester,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.isLoading=true;
        this.service.getAll().subscribe(rules => {
            this.rules = rules;
            this.isLoading=false;
        }, error => {
            this.isLoading=false;
            // TODO display error
            console.log(error);
        });
    }

    select(selected: RuleModel, $event?: any) {
        this.selected = selected;
    }

    add($event: any) {
        // Initialize the default values here.
        const rule: RuleModel = this.emptyRule();
        this.select(rule, $event);
        this.context.set('selected-rule', rule);
        this.router.navigate(['admin/rule-engine/add']);
    }

    edit(selected: RuleModel, $event?: any) {
        this.select(selected, $event);
        this.context.set('selected-rule', selected);
        this.router.navigate(['admin/rule-engine/edit']);
    }

    confirmAnddelete(selected: RuleModel, $event?: any) {
        this.select(selected, $event);
        this.deleteConfirmationModal.show();
    }

    delete(selected: RuleModel, $event?: any) {
        this.deleteConfirmationModal.hide();
        this.service.delete(selected.id).subscribe(rules => {
            this.rules = rules;
            this.context.notify(null);
        });
    }

    confirmAndChangeStatus(rule: RuleModel, $event: any) {
        this.select(rule, $event);
        rule.status = !rule.status;
        this.statusChangeModal.show();
    }

    onStatusChange(rule: RuleModel, $event: any) {
        this.statusChangeModal.hide();
        this.service.update(rule).subscribe(updatedRule => {

        });
    }

    cancelStatusChange(rule: RuleModel) {
        this.statusChangeModal.hide();
        rule.status = !rule.status;
    }

    private emptyRule(): RuleModel {
        const today = new Date();


        const startTime = new Date();
        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        const endTime = new Date();
        endTime.setHours(23);
        endTime.setMinutes(0);
        endTime.setSeconds(0);
        const rule: RuleModel = {
                name: '',
                alarmName: '',
                status: true,
                updatedBy: 'Admin User',
                publishedBy: '',
                updatedOn: today,
                onStateDelay: 0,
                offStateDelay: 0,
                daySchedule: [],
                excludeDays: [],
                startTimeSchedule: startTime,
                endTimeSchedule: endTime,
                tags: [],
                output: {
                    alarm_des: '',
                    normal_des: '',
                    pri: 1,
                    val: 0
                },
                rawRule: {
                    ruleSet: {
                        condition: 'and',
                        rules: [
                            {
                                'field': null,
                                'operator': null,
                                'value': null,
                                'unit': null
                            }
                        ]
                    }
                  },
                  assets: []
            } as RuleModel;
        return rule;
    }

    test(rule: RuleModel) {
        console.log(rule);
        this.testRule = rule;
        this.testRule.testInProgress = true;
        this.getAssetsStates(rule);
    }

    getAssetsStates(rule: RuleModel) {
        this.assetStates = [];
        const excludeAssets = [];
        rule.assets.forEach(assetStateJson => {
            const assetStateObj = {
                assetSerialNumber: assetStateJson.assetSerialNumber,
                state: this._getDataPoints()
            };
            this.assetStates.push(assetStateObj);

            this.ruleTester.testRule(rule, this.assetStates, excludeAssets)
            .subscribe((testResults: TestResult[]) => {
                this.testResults = testResults;
                this.testRule.testInProgress = false;
                this.afterTest();
            });
        });
    }

    afterTest() {
        this.showTestResult = true;
    }

    onTestResultModalClose() {
        this.showTestResult = false;
    }


    _getDataPoints() {
        const date = new Date();
        const metrics = [
            {
                name: 'Current storage application',
                value: 'EV Charging and FR',
                unit: '',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'Power Output',
                value: '2400',
                unit: 'kW',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'Output frequency',
                value: '55',
                unit: 'Hz',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'Output voltage AC',
                value: '13.2',
                unit: 'kV',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'System Efficiency',
                value: '91',
                unit: '%',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'AC Circuit Breaker',
                value: 'Closed',
                unit: '',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'DC circuit breaker',
                value: 'Closed',
                unit: '',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'Acceleration',
                value: '0',
                unit: 'm/s<sup>2</sup>',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'Deceleration',
                value: '0',
                unit: 'm/s<sup>2</sup>',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'Vibration Frequency',
                value: '0',
                unit: 'Hz',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'Battery Container Temperature',
                value: '25',
                unit: '&deg;C',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'External Temperature',
                value: '30',
                unit: '&deg;C',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'HVAC coolant level',
                value: '94',
                unit: '%',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'DC Bus Voltage',
                value: '1300',
                unit: 'V',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'Audible noise',
                value: '30',
                unit: 'dB',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'Fire Suppression System',
                value: 'Active',
                unit: '',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'Relative external humidity',
                value: '73',
                unit: '%',
                lastUpdated: date,
                status: 'OK'
            },
            {
                name: 'Altitude',
                value: '1000',
                unit: 'm',
                lastUpdated: date,
                status: 'OK'
            }
        ];

        return metrics;
    }

    confirmPublish(rule: RuleModel) {
        this.selected = rule;
        this.publishConfirmationModal.show();

    }

    publish(rule: RuleModel, $event?: any) {
        this.publishConfirmationModal.hide();
        if (rule.published) {
            rule.published = false;
            rule.publishedBy = null;
            rule.publishedOn = null;
        } else {
            rule.published = true;
            rule.publishedBy = 'Admin User';
            rule.publishedOn = new Date();
        }
        this.ruleEngineSerivce.update(rule).subscribe(updatedRule => {
            console.log(updatedRule);
        });
    }

    void() {

    };
    rulesList=[];
    displayData(totalDatas) {
        this.rulesList = totalDatas;
    }
}
