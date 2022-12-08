import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/base.service';
import { Organization } from '../../../models';
import { Observable } from 'rxjs';
import { RuleModel, RuleModelDTO } from './models/rule.model';
import { Datapoint, Payload } from './models/rule-builder.interace';
import { UnitConversionFormulaService } from './unit-conversion-formula.service';
import { AppService } from '../../../app.service';
import { AppContext } from '../../../app.context';
import { HttpClient } from '@angular/common/http';
import { Api, ServerType } from '../../../services/Api';
import { User } from '../../../models/user.model';

@Injectable()
export class RuleEngineService extends BaseService {

    serverType:ServerType = ServerType.rcpaiServer;
    constructor(
        appContext: AppContext,
        http: HttpClient,
        private unitConvertor: UnitConversionFormulaService
    ) {
        super(appContext, http);
        //this.initialize();
    }

    // create(rule: RuleModel): Observable<any> {
    //     return this._post(`rule`, rule);
    // }

    // update(rule: RuleModel): Observable<any> {
    //     return this._put(`rule`, rule);
    // }

    // delete(ruleId: string): Observable<any> {
    //     return this._delete(`rule/${ruleId}`);
    // }

    // get(ruleId: string): Observable<any> {
    //     return this._get(`rule/${ruleId}`);
    // }

    // getAll(): Observable<any> {
    //     return this._get(`rule`);
    // }

    create(rule: RuleModel): Observable<any> {
        let dto = RuleModelDTO.toRuleModelDto(rule) ;//this.transformtoRuleDto(rule)
        let login = this.appContext.get('logged-in-user') as User;
        dto['createdBy'] = login.firstName
        dto['createdOn'] = new Date()
        dto['groupId'] = 'dummyId'
        dto['owner'] = login.firstName;
        
        return this._postNew(this.serverType, Api. ruleEngineCreate.uri, this.transformRuleDTOToJSON(dto));
    }

    update(rule: RuleModel): Observable<any> {
        let dto = RuleModelDTO.toRuleModelDto(rule) ;//this.transformtoRuleDto(rule)
        return this._putNew(this.serverType, Api. ruleEngineUpdate.uri, this.transformRuleDTOToJSON(dto));
    }

    delete(ruleId: string): Observable<any> {
        return this._deleteNew(this.serverType, Api. ruleEngineDelete.uri + `${ruleId}`);
    }

    get(ruleId: string): Observable<any> {
       //return this._getNew(this.serverType, Api.ruleEngine.uri + `${ruleId}`, this.transformRuleModel);
       return this._getNew(this.serverType, Api.ruleEngine.uri + `${ruleId}`);
    }
   
   // getAssetsBycompany(companyId: string): Observable<any> {
     //   return this._getNew(this.serverType, Api.getAssetsBycompany.uri + `${companyId}`);
    //}

    getAll(): Observable<any> {
        return this._getNew(this.serverType, Api.ruleEngineList.uri);
    }

    getRulePropertyAll(): Observable<any> {
        return this._getNew(this.serverType, Api.rulePropertyList.uri);
    }

    getRulesBycompany(companyId: string): Observable<any> {
        //return this.getAll();
        return this._getNew(this.serverType, Api.getRulesBycompany.uri + `${companyId}`);
    }

    getAllDataPoints(datapoints : Datapoint[]): Observable<any> {
        const observable = new Observable<any>((subscriber) => {
            //const datapoints = this._getAllDataPoints();
            const assetType = 'Charging Vehicle';
            const payload: Payload = {
                name: 'Realtime',
                assetType: assetType,
                datapoints: datapoints,
                assetTypeArray: [assetType]
            } as Payload;
            payload[assetType] = datapoints;
            const datapointsMap: { [key: string]: Datapoint } = {};
            payload.datapointsMap = datapointsMap;
            datapoints.forEach(datapoint => {
                datapointsMap[datapoint.name] = datapoint;
                datapoint.applicableAssets = [];
                if (datapoint.unit != null && datapoint.unit !== '') {
                    datapoint.possibleUnits = [datapoint.unit];
                    const anotherUnit = this.unitConvertor.convertUnitText(datapoint.unit);
                    if (anotherUnit != null && datapoint.unit !== datapoint.unit) {
                        datapoint.possibleUnits.push(anotherUnit);
                    }
                }
            });
            subscriber.next(payload);
        });

        return observable;
    }

    

    private initialize() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dayBeforeYesterday = new Date();
        dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

        const future10Days = new Date();
        future10Days.setDate(future10Days.getDate() + 10);
        const future20Days = new Date();
        future20Days.setDate(future20Days.getDate() + 20);
        const startTime = new Date();
        startTime.setHours(9);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        const endTime = new Date();
        endTime.setHours(18);
        endTime.setMinutes(0);
        endTime.setSeconds(0);
        const rules: RuleModel[] = [
            {
                id: this.generateId(),
                name: 'Check Low Power output',
                alarmName: 'Low Power output',
                status: true,
                updatedBy: 'Admin User',
                publishedBy: 'Admin User',
                updatedOn: dayBeforeYesterday,
                publishedOn: yesterday,
                onStateDelay: 15,
                offStateDelay: 15,
                daySchedule: ['Mon', 'Tue', 'Wed'],
                //excludeDays: [future10Days, future20Days],
                excludeDays: [],
                startTimeSchedule: startTime,
                endTimeSchedule: endTime,
                tags: ['Rule Engine', 'Power'],
                output: {
                    alarm_des: 'Power output went low',
                    normal_des: 'Power ouput become normal',
                    pri: 1,
                    val: '100'
                },
                rawRule: {
                    ruleSet: {
                        condition: 'or',
                        rules: [
                            {
                                'field': 'Power Output',
                                'operator': '<',
                                'value': 100,
                                'unit': 'kW'
                            },
                            {
                                'field': 'Output voltage AC',
                                'operator': '<',
                                'value': 10,
                                'unit': 'kV'
                            }
                        ]
                    }
                },
                assets: [
                    {
                        assetId: this.generateId(8),
                        assetSerialNumber: 'J1772COMBO',
                        assetType: 'Charging Vehicle'
                    },
                    {
                        assetId: this.generateId(10),
                        assetSerialNumber: 'EVSJ8c4u93K',
                        assetType: 'Charging Vehicle'
                    }
                ]
            }
        ] as RuleModel[];
        this.setItems('rule', rules, false);

    }

    initializeRuleModel(rule:RuleModel) {
        const rules: RuleModel[] = [];
        rules.push(rule);
        this.setItems('rule', rules, false);
    }


    _getAllDataPoints(): Datapoint[] {
        const metrics = [
            {
                name: 'Current storage application',
                unit: '',
                type: 'string'
            },
            {
                name: 'Power Output',
                unit: 'kW',
                type: 'number'
            },
            {
                name: 'Output frequency',
                unit: 'Hz',
                type: 'number'
            },
            {
                name: 'Output voltage AC',
                unit: 'kV',
                type: 'number'
            },
            {
                name: 'System Efficiency',
                unit: '%',
                type: 'number'
            },
            {
                name: 'AC Circuit Breaker',
                unit: '',
                type: 'string'
            },
            {
                name: 'DC circuit breaker',
                unit: '',
                type: 'string'
            },
            {
                name: 'Acceleration',
                unit: 'm/s<sup>2</sup>',
                type: 'number'
            },
            {
                name: 'Deceleration',
                unit: 'm/s<sup>2</sup>',
                type: 'number'
            },
            {
                name: 'Vibration Frequency',
                unit: 'Hz',
                type: 'number'
            },
            {
                name: 'Battery Container Temperature',
                unit: '&deg;C',
                type: 'number'
            },
            {
                name: 'External Temperature',
                unit: '&deg;C',
                type: 'number'
            },
            {
                name: 'HVAC coolant level',
                unit: '%',
                type: 'number'
            },
            {
                name: 'DC Bus Voltage',
                unit: 'V',
                type: 'number'
            },
            {
                name: 'Audible noise',
                unit: 'dB',
                type: 'number'
            },
            {
                name: 'Fire Suppression System',
                unit: '',
                type: 'string'
            },
            {
                name: 'Relative external humidity',
                unit: '%',
                type: 'number'
            },
            {
                name: 'Altitude',
                unit: 'm',
                type: 'number'
            }
        ] as Datapoint[];
        return metrics;
    }

     transformRuleDTOToJSON(ruleDto : RuleModelDTO) {
        let jsonRuleDto = {}
        Object.assign(jsonRuleDto, ruleDto, {
            //compiledRule: ruleDto.compiledRule2
        })
        // Acomment*
        console.log(jsonRuleDto);
        return jsonRuleDto
    }

}
