import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RuleEngineService } from '../rule-engine.service';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { RuleValidator } from './rule.validator';
import { ValidationError, ValidationSpec } from '../../../../services/base.validator';
import { FormControl } from '@angular/forms';
import { RuleModel } from '../models/rule.model';
import { Payload } from '../models/rule-builder.interace';
import { RuleAssetModel } from '../models/rule-asset-map.model';
import { RuleSet, Rule } from '../rule-builder/query-builder';
import { RuleBuilderComponent } from '../rule-builder/rule-builder.component';
import { ChargingVehicleService } from '../../charging-vehicle/charging-vehicle.service';
import { ChargingVehicle } from '../../../../models/charging-vehicle.model';
import { DatePipe } from '@angular/common';

const alarmPriorities = {
    'Critical': 1,
    'Low': 2,
    'Maintenance': 3,
    'Emergency': 4,
    'Fire': 5,
    'Test': 6
};

@Component({
    selector: 'app-rule',
    templateUrl: 'rule.component.html',
    styleUrls: ['rule.component.scss']
})
export class RuleComponent implements OnInit {

    changed: boolean;
    validationErrors: {[key: string]: ValidationError};
    validationSpecs: {[key: string]: ValidationSpec} = {};

    @ViewChild('discardConfirmationModal')
    public discardConfirmationModal: ModalDirective;

    public addressControl: FormControl = new FormControl();
    @ViewChild('addressRef')
    public addressElementRef: ElementRef;

    // Rule Engine Specific Starts
    @ViewChild('alarmValueDropdown') alarmValueDropdown: any;
    @ViewChild('alarmNameDropdown') alarmNameDropdown: any;
    rules: RuleModel[] = []; // List of existing rule
    rule: RuleModel; // Current Rule being edited or new Rule
    add: boolean;
    saveDisabled = true;
    payload: Payload = {name: 'realTime', assetTypes: {}, datapoints: []} as Payload;

    assets: RuleAssetModel[] = [];
    applicableAssets: RuleAssetModel[] = [];
    alarmPriorities = alarmPriorities;
    statuses = [1, 2, 3];
    statusesName = ['critical', 'maintenance', 'low'];
    timeZone: string;
    assetsSetting: any = {text: 'Select Assets',
        enableSearchFilter: true,
        searchBy: ['assetSerialNumber'],
        enableFilterSelectAll: false,
        labelKey: 'assetSerialNumber',
        primaryKey: 'assetSerialNumber'
    };
    timeRangeValue = [0, 24];
    showList = true;
    errors: any = {};
    tags: any[] = [];
    assetTypes: string[] = [];
    ruleContentHeight: 0;
    objectKeys = Object.keys;
    disabled: boolean;
    datalistNeeded: boolean;
    alarmOutputValueOptions: any[];

    // Shows if the add rule is in progress;
    requestInProgress = false;
    startTime: string;
    endTime: string;
    ruleAlarmName: any[] = []; // For angular2-multiselect-dropdown
    ruleAlarmValue: any[] = [];
    filter: string;


    @ViewChild('ruleHeader') ruleHeader:  ElementRef<any>;
    @ViewChild('ruleBuilder') ruleBuilder: RuleBuilderComponent;

    // Rule Engine Specific Ends

    constructor(
        private service: RuleEngineService,
        private chargingVehicleSerivce: ChargingVehicleService,
        private validator: RuleValidator,
        private datePipe: DatePipe,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }
    ngOnInit() {
        const rule = this.context.getCopy('selected-rule');
        if (rule == null) {
            this.gotoListing();
            return;
        }
        this.rule = rule;
        this.initializeDataPoints();
        this.errors = {};

        this.timeRangeValue = [0, 24];
        if (this.rule.startTimeSchedule != null) {
            if (!(this.rule.startTimeSchedule instanceof Date)) {
                this.rule.startTimeSchedule = new Date(this.rule.startTimeSchedule);
            }
            this.timeRangeValue[0] = this.rule.startTimeSchedule.getHours();
        }
        if (this.rule.endTimeSchedule != null) {
            if (!(this.rule.endTimeSchedule instanceof Date)) {
                this.rule.endTimeSchedule = new Date(this.rule.endTimeSchedule);
            }
            this.timeRangeValue[1] = this.rule.endTimeSchedule.getHours() + 1;
        }

        this.tags = [];
        if (this.rule.tags) {
            this.rule.tags.forEach(tag => {
                this.tags.push({
                    display: tag,
                    value: tag
                });
            });
        }
    }

    gotoListing() {
        this.router.navigate(['../list'], {relativeTo: this.route});
    }

    markChange($event: any) {
        this.changed = true;
    }

    close($event?: any) {
        this.gotoListing();
    }

    save($event: any) {
        this.rule.tags = [];
        this.tags.forEach(tag => {
            this.rule.tags.push(tag.value);
        });
        this.setRuleOutputUnit();
        this.rule.rule = this.ruleBuilder.compileCodeAsString();
        if (!this.rule.offStateDelay) {
           this.rule.offStateDelay = 0;
        }

        if (!this.rule.onStateDelay) {
            this.rule.onStateDelay = 0;
        }
        this._save($event);
        this.context.notify(null);
    }

    _save($event: any) {
        this.rule.updatedBy = 'Admin User';
        this.rule.updatedOn = new Date();
        let service: Observable<any> = null;
        if (this.rule.id == null) {
            service = this.create($event);
        } else {
            service = this.update($event);
        }
        service.subscribe(organization => {
            this.changed = false;
            this.close($event);
        });
    }

    create($event: any) {
        return this.service.create(this.rule);
    }

    update($event: any) {
        return this.service.update(this.rule);
    }

    checkAndClose($event: any) {
        if (this.changed) {
            this.discardConfirmationModal.show();
        } else {
            this.close($event);
        }
    }


    // Rule Engine Specific Starts

    initializeDataPoints() {
        this.saveDisabled = true;
        if (this.rule.assetType) {
            this.payload.assetTypeArray = this.rule.assetType;
        }
        const dataPoints = this.service._getAllDataPoints();
        this.service.getAllDataPoints(dataPoints).subscribe(payload => {
            this.payload = payload;
            if (this.rule.assetType == null) {
                this.rule.assetType = payload.assetType;
            } else {
                payload.assetType = this.rule.assetType;
            }
            this.saveDisabled = false;
            this.fetchAssets();
        });
    }

    fetchAssets() {
        this.assets = [];
        this.applicableAssets = [];
        const datapointApplicableAssests = [];
        this.chargingVehicleSerivce.getAll().subscribe((chargingVehicles: ChargingVehicle[]) => {
            const assetMap = {};
            console.log(chargingVehicles);
            chargingVehicles.forEach(chargingVehicle => {
                if (assetMap[chargingVehicle.assetSerialNumber] == null) {
                    const asset = {
                        assetId: chargingVehicle.id,
                        assetSerialNumber: chargingVehicle.assetSerialNumber,
                        assetType: 'Charging Vehicle'
                    } as RuleAssetModel;
                    this.assets.push(asset);
                    this.applicableAssets.push(asset);
                    assetMap[chargingVehicle.assetSerialNumber] = chargingVehicle;
                    datapointApplicableAssests.push(asset.assetSerialNumber);
                }
            });
            this.payload.datapoints.forEach(datapoint => {
                datapoint.applicableAssets = datapointApplicableAssests;
            });
        });
    }

    handleDatapointChanged($event: any) {  // need to understand this part.
        /*
        const assetsMap = {};
        let applicableAssets = [];
        if (this.rule.rawRule && this.rule.rawRule.datapoints && this.payload.datapointsMap) {
            Object.keys(this.rule.rawRule.datapoints).forEach(datapointName => {
                const datapoint = this.payload.datapointsMap[datapointName];

                // If the applicableAssets for datapoint has null,
                // It is applicable for all assets of selected Asset Type
                if (datapoint) {
                    if (datapoint.applicableAssets.includes(null)) {
                        if (this.rule.assetType === 'N/A') {
                            // For performance commented below code
                            applicableAssets = this.assets.slice();
                            // this.assets.forEach((asset) => {
                            //     assetsMap[asset.assetId] = asset;
                            //     if (!this.applicableAssets.find((applicableAsset) => applicableAsset.assetId === asset.assetId)) {
                            //         this.applicableAssets.push(asset);
                            //     }
                            // })
                        } else {
                            // For performance commented below code
                            applicableAssets = this.assets.filter((asset: RuleAssetModel) => asset.assetType === this.rule.assetType);
                            // this.assets.forEach((asset) => {
                            //     assetsMap[asset.assetId] = asset;
                            //     if (asset.assetType === this.rule.assetType) {
                            //         if (!this.applicableAssets.find((applicableAsset) => applicableAsset.assetId === asset.assetId)) {
                            //             this.applicableAssets.push(asset);
                            //         }
                            //     }
                            // });
                        }
                    } else  {
                        if (datapoint.applicableAssets) {
                            datapoint.applicableAssets.forEach(assetSerialNumber => {
                                if (assetsMap[assetSerialNumber] == null) {
                                    const applicableAsset =  this.assets.find(
                                        asset => asset.assetSerialNumber === assetSerialNumber
                                        && this.rule.assetType === asset.assetType);
                                    if (applicableAsset) {
                                        assetsMap[assetSerialNumber] = applicableAsset;
                                        applicableAssets.push(applicableAsset);
                                    }
                                }
                            });
                        }
                    }
                }

            });
        }
        this.applicableAssets = applicableAssets;
        this.setRuleOutputUnit();
        this.setAlarmOutputValueOptions();
        */
    }

    setAlarmOutputValueOptions() {
        this.alarmOutputValueOptions = [];
        this.ruleAlarmValue = []; // For Angular2-multiselect
        let hasValidDatapoint = false;
        if (this.rule.rawRule && this.rule.rawRule.datapoints) {
            Object.keys(this.rule.rawRule.datapoints).forEach(datapointName => {
                const alarmOutputValueOption = {
                    id: datapointName,
                    itemName: datapointName
                };
                // tslint:disable-next-line:max-line-length
                if (!this.alarmOutputValueOptions.find((alarmOutputValueOptionElement: any) => alarmOutputValueOptionElement.itemName === datapointName)) {
                    this.alarmOutputValueOptions.push(alarmOutputValueOption);
                }
                if (this.rule.output['val'] === datapointName) {
                    this.ruleAlarmValue.push(alarmOutputValueOption);
                    hasValidDatapoint = true;
                }
            });
        }
        this.alarmOutputValueOptions.unshift({id: 'Rule Output', itemName: 'Rule Output'});
        this.alarmOutputValueOptions.unshift({id: 'Null', itemName: 'Null'});
        if (this.rule.output['type'] === 'datapoint' && !hasValidDatapoint) {
            this.rule.output['val'] = 'Null';
            this.rule.output['type'] = null;
            const defaultAlarmValue = {
                id: 'Null',
                itemName: 'Null'
            };
            this.ruleAlarmValue.push(defaultAlarmValue);
            hasValidDatapoint = true;
        }
        if (!hasValidDatapoint) {
            const alarmValue = {
                id: this.rule.output['val'],
                itemName: this.rule.output['val']
            };
            this.ruleAlarmValue.push(alarmValue);
        }
    }

    clearRuleOutputValue() {
        this.rule.output.value = 'Null';
    }

    clearRuleOutputName() {
        this.rule.output.name = '';
    }

    setRuleOutputUnit() {
        if (this.rule.output.val && this.rule.output.val.trim() !== '') {
            const ruleWithDataPoint = this.findRuleByDatapoint(this.rule.output.val);
            if (ruleWithDataPoint && 'unit' in ruleWithDataPoint) {
                this.rule.output.unit = ruleWithDataPoint.unit;
            } else {
                this.rule.output.unit = '';
            }
        }

    }

    findRuleByDatapoint(datapoint: string) {
        let foundRule;
        if (this.rule && this.rule.rawRule && this.rule.rawRule.ruleSet && this.rule.rawRule.ruleSet.rules) {
            foundRule = this._findRuleByDataPoint(this.rule.rawRule.ruleSet.rules, datapoint);
        }
        return foundRule;

    }

    _findRuleByDataPoint(rules: (RuleSet | Rule)[], datapoint: string) {
        let ruleWithDataPoint;
        for (const rule of rules) {
            if ('field' in rule) {
                if (rule.field === datapoint) {
                    ruleWithDataPoint = rule;
                    break;
                }
            }

            if (!ruleWithDataPoint && 'rules' in rule && rule.rules) {
                ruleWithDataPoint = this._findRuleByDataPoint(rule.rules, datapoint);
                if (ruleWithDataPoint) {
                    break;
                }
            }

            if (!ruleWithDataPoint && 'elseRules' in rule && rule.elseRules) {
                ruleWithDataPoint = this._findRuleByDataPoint(rule.elseRules, datapoint);
                if (ruleWithDataPoint) {
                    break;
                }
            }
        }
        return ruleWithDataPoint;

    }

    onTimeChange(timeRangeValue: number[]) {
        if (timeRangeValue && timeRangeValue.length === 2) {
            this.timeRangeValue = timeRangeValue;
            this.rule.startTimeSchedule.setHours(timeRangeValue[0]);
            this.rule.startTimeSchedule.setMinutes(0);
            this.rule.endTimeSchedule.setHours(timeRangeValue[1] - 1);
            this.rule.endTimeSchedule.setMinutes(59);
            this.rule.endTimeSchedule.setSeconds(59);
        }
        this.formatTimeRange();
    }

    formatTimeRange() {
        this.startTime = this.format(this.timeRangeValue[0], this.datePipe);
        this.endTime =  this.format(this.timeRangeValue[1], this.datePipe);
    }

    format(hours: number, datePipe: DatePipe) {
        const date = new Date();
        date.setHours(hours);
        const hoursString = datePipe.transform(date, 'hh:00 a');
        return hoursString;
    }

    onDayScheduleChange(sceduledDayObjects: any[]) {
        this.rule.daySchedule = [];
        sceduledDayObjects.forEach(dayObject => {
            this.rule.daySchedule.push(dayObject['sort']);
        });
    }


    // Rule Engine Specific Ends

    initializeValidationRules() {
        const validationSpecs = [
        ] as ValidationSpec[];
        this.validator.setValidationSpecs(validationSpecs);
        validationSpecs.forEach(validationSpec => {
            this.validationSpecs[validationSpec.field] = validationSpec;
        });
    }
}
