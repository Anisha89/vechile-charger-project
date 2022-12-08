// import RuleAssetViewMapModel
import { DatePipe } from '@angular/common';
import { RawRule } from './rule-builder.interace';
import { RuleAssetModel } from './rule-asset-map.model';
import { StringUtils } from '../../../../models/utils.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RuleSet } from '../rule-builder/query-builder';

const DEFAULT_DATE_FORMAT = 'MM/dd/yyyy, hh:mm a';
const ISO_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss'; // FOR MOMENT
const UTC_DATE_FORMAT = 'yyyy-MM-ddThh:mm:ss';


export const alarmPriorities = [
    'Critical',
    'Low',
    'Maintenance',
    'Emergency',
    'Fire',
    'Test'];

export const NOTIFICATON_ALARM :string = "alarm";
export const NOTIFICATON_EMAIL :string = "email";
export const NOTIFICATON_SMS  :string = "sms";


/**
 * This is the RuleModel class which contains attributes/data for a Rule.
 */
export class RuleModel {
    id: string;
    name: string;
    assetType:string[]=[];
    rawRule: RawRule; // JSON Object ???
    rawRuleString : string;
    compiledRule: string;
    compiledRule2: string;
    alarmName?: string;
    output: any = {
        name: '', // alarm name
        alarm_des: '',
        normal_des: '',
        pri: '',
        val: '',
        unit: '', // not with back-end code
    };
    onStateDelay: number;
    offStateDelay: number;
    notifications: string[]=[];
    assetIds: string[]=[];
    daySchedule: string[] = [];
    excludeDays: string[] = [];//???? string / date we need to disucss
    assets: RuleAssetModel[]; // ???
    startTimeSchedule: Date = new Date();
    endTimeSchedule: Date = new Date();
    tags: string[]=[];
    owner: string;
    createdOn: Date;
    updatedOn: Date;
    status: boolean;
    updatedBy: string;
    published: boolean;
    publishedOn: Date;
    publishedBy: string;
    createdBy: string;
    companyId: string;
    companyName: string;
  
     // additional fields
    createdOrUpdatedBy?: String;
    createdOrUpdatedOn?: Date;
    publishStatusChanging?: boolean;
    statusChanging?: boolean;
    testInProgress?: boolean;
    ruleType: string; //???
    rule: string; //???
    localOrRemote:boolean = false;


    isNotificationType(notification:string) {
         return this.notifications.indexOf(notification) >=0 ? true: false;
    }

    toggleNotificationType(notification:string) {
        let index = this.notifications.indexOf(notification);
        (index >=0) ? this.notifications.splice(index,1) : this.notifications.push(notification);
    }


    createCompiledRuleQuery() {
        try {
            let temp = JSON.parse(this.compiledRule);
            return temp;
        }
        catch(error) {
        }
        return null;
    }

    static createUITags(tags :string[]) {
        let uiTags : any[] = []
        if (tags) {
            tags.forEach(tag => {
            uiTags.push({
                display: tag,
                value: tag
                });
            });
        }
        return uiTags;
    }

    static createFromUITags(uiTags:any[]) {
        let tags : string[] = []
        if (uiTags) {
            uiTags.forEach(uiTag => {
                tags.push(uiTag.value);
            });
        }
        return tags;
    }


    // this.tags = [];
    //    if (this.rule.tags) {
    //         this.rule.tags.forEach(tag => {
    //             this.tags.push({
    //                display: tag,
    //                value: tag
    //             });
    //         });
    //     }

    static toRuleModel(dto: RuleModelDTO) {
        let model = new RuleModel();
        model.id = dto.id;
        model.name = dto.name;
        model.assetType = StringUtils.stringToArray(dto.domainTypes,",");
       
        model.rawRuleString = atob(dto.rawRule); // decode
        model.compiledRule = atob(dto.compiledRule); // decode
        model.rawRule = RuleModel.createRawRule(model.rawRuleString);

       // model.assets = RuleAssetModel
       
        model.alarmName = dto.alarmName;
        
        model.output.alarmName = dto.alarmName;
        model.output.alarm_des = dto.alarmDescription;
        model.output.normal_des = dto.normalDescription;
        model.output.pri = dto.priority ;
        model.output.val = dto.value;

        model.onStateDelay = dto.onStateDelaySecs;
        model.offStateDelay = dto.offStateDelaySecs;
       
        model.notifications = StringUtils.stringToArray(dto.notifications,",");
        model.assetIds = StringUtils.stringToArray(dto.assetIds,",");
        model.daySchedule = StringUtils.stringToArray(dto.daySchedules,",");
        model.excludeDays = StringUtils.stringToArray(dto.excludeDays,",");
        model.startTimeSchedule = dto.timeFrom? dto.timeFrom : new Date();
        model.endTimeSchedule = dto.timeTo ? dto.timeTo : new Date();
        model.tags = RuleModel.createUITags(StringUtils.stringToArray(dto.tags,","));
        model.owner = dto.owner;
        model.createdBy = dto.createdBy;
        model.createdOn = dto.createdOn;
        model.updatedOn = dto.updatedOn;
        model.status = dto.isActive;
        model.published = dto.published;
        model.publishedOn = dto.publishedOn;
        model.publishedBy = dto.publishedBy;
        model.companyId = dto.companyId;
        model.companyName = dto.companyName;
        model.localOrRemote = dto.localOrRemote;
        return model;
    }

    static createEmptyRule() {
        let model = new RuleModel();
     
        const today = new Date();
        const startTime = new Date();
        const endTime = new Date();
        
        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        
        endTime.setHours(23);
        endTime.setMinutes(0);
        endTime.setSeconds(0);

        model.startTimeSchedule = startTime;
        model.endTimeSchedule = endTime;
        model.status=true
        model.output.pri='Critical'
        model.updatedBy= 'Admin User',
        model.tags=[];
        model.rawRule = RuleModel.createEmptyRawRule();
        model.assetType=[];
        model.assetIds=[];
        return model;

        /*
        const model: RuleModel = {
                name: '',
                alarmName: '',
                isActive: true,
                updatedBy: 'Admin User',
                publishedBy: '',
                updatedOn: today,
                onStateDelaySecs: 0,
                offStateDelaySecs: 0,
                daySchedules: [],
                excludeDays: [],
                timeFrom: startTime,
                timeTo: endTime,
                tags: [],
                output: {
                    alarm_des: '',
                    normal_des: '',
                    pri: 1,
                    val: 0
                },
                // rawRule: {
                //     ruleSet: {
                //         condition: 'and',
                //         rules: [
                //             {
                //                 'field': null,
                //                 'operator': null,
                //                 'value': null,
                //                 'unit': null
                //             }
                //         ]
                //     }
                //   },
                  assets: []
            } ;
        return model;
        */
    }

    static createRawRule(rawRuleString:string) {
        try {
            let rawRule  = {} as RawRule; 
            let temp = JSON.parse(rawRuleString);
            let ruleSet = {} as RuleSet;
            ruleSet.condition = temp.condition;
            ruleSet.rules = temp.rules;
            rawRule.ruleSet = ruleSet;
            return rawRule;
        }
        catch(error) {

        }
        return null;
    }

    static createEmptyRawRule() {
        let rawRule  = {
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
         } as RawRule; 
         return rawRule;
    }

    static createCompiledRuleQuery(compiledRule:string) {
        try {
            let temp = JSON.parse(compiledRule);
            return temp;
        }
        catch(error) {
        }
        return null;
    }

}

/*
{
    "created_by":3,
    "createdBy":"admin"
}

*/

// database table
export class RuleModelDTO {
    id: string;
    name: string;
    domainTypes: string;
    rawRule: string;
    compiledRule: string;
    alarmName: string;
    alarmDescription: string;
    normalDescription: string;
    onStateDelaySecs: number;
    offStateDelaySecs: number;
    priority: string;
    value: number;
    notifications: string;
    assetIds: string;
    daySchedules: string;
    excludeDays: string;
    timeFrom: Date;
    timeTo: Date;
    tags: string;
    owner: string;
    createdBy:string;
    createdOn: Date;
    updatedOn: Date;
    isActive: boolean;
    published: boolean;
    publishedOn: Date;
    publishedBy: string;
    companyId: string;
    companyName: string;
    localOrRemote:boolean = false;


    static toRuleModelDto(model: RuleModel) {
        let dto = new RuleModelDTO();
        dto.id = model.id;
        dto.name = model.name;
        dto.domainTypes = StringUtils.stringArrayToString(model.assetType, ",");
        dto.rawRule = btoa(model.rawRuleString);
        dto.compiledRule = btoa(model.compiledRule2);
        dto.alarmName = model.alarmName;
        dto.alarmDescription = model.output.alarm_des;
        dto.normalDescription = model.output.normal_des;
        dto.priority = model.output.pri;
        dto.value = model.output.val;
        dto.onStateDelaySecs = model.onStateDelay;
        dto.offStateDelaySecs = model.offStateDelay;
        dto.notifications = StringUtils.stringArrayToString(model.notifications, ",");
        dto.assetIds = StringUtils.stringArrayToString(model.assetIds, ",");
        dto.daySchedules = StringUtils.stringArrayToString(model.daySchedule, ",");
        dto.excludeDays = StringUtils.stringArrayToString(model.excludeDays, ",");
        dto.timeFrom = model.startTimeSchedule;
        dto.timeTo = model.endTimeSchedule;
        dto.tags =   StringUtils.stringArrayToString(RuleModel.createFromUITags(model.tags),",");
        dto.owner = model.owner;
        dto.createdBy = model.createdBy;
        dto.createdOn = model.createdOn;
        dto.updatedOn = model.updatedOn;
        dto.isActive = model.status;
        dto.published = model.published;
        dto.publishedOn = model.publishedOn;
        dto.publishedBy = model.publishedBy;
        dto.companyId = model.companyId;
        dto.companyName = model.companyName;
        dto.localOrRemote = model.localOrRemote;
        return dto;
    }
}
