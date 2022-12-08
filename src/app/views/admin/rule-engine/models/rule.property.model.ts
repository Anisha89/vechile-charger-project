// import RuleAssetViewMapModel
import { DatePipe } from '@angular/common';
import { RawRule } from './rule-builder.interace';
import { RuleAssetModel } from './rule-asset-map.model';
import { StringUtils } from '../../../../models/utils.model';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Datapoint} from './rule-builder.interace';


/**
 * This is the RulePropertyModel class which contains rule property model.
 */

/*
"id": 1,
"name": "Speed",
"category": "General",
"unit": "km",
"type": "integer"
*/

export class RulePropertyModel {
    id: string;
    name: string;
    category: string;
    unit:string;
    type:string;
    value:string;
    status:string;
    lastUpdated:Date;

    static toRulePropertyModel(dto: RulePropertyModelDto) {
        let model : RulePropertyModel = new RulePropertyModel();
        model.id = dto.id;
        model.name = dto.name;
        model.category = dto.category;
        model.unit = dto.unit;
        model.type = dto.type;
        model.value = dto.value;
        model.status = dto.status;
        model.lastUpdated = dto.lastUpdated;
        return model;
    }

    static createDatapoint(model:RulePropertyModel) {
        let dataPoint = {
            name : model.name,
            unit : model.unit,
            type : model.type,
            value : model.value,
            status : model.status,
            lastUpdated : model.lastUpdated,
        } as Datapoint
        return dataPoint;
    }

}

export class RulePropertyModelDto {
    id: string;
    name: string;
    category: string;
    unit:string;
    type:string;
    value:string;
    status:string;
    lastUpdated:Date;

    static toRulePropertyModel(model: RulePropertyModel) {
        let dto : RulePropertyModelDto = new RulePropertyModelDto();
        dto.id = model.id;
        dto.name = model.name;
        dto.category = model.category;
        dto.unit = model.unit;
        dto.type = model.type;
        dto.value = model.value;
        dto.status = model.status;
        dto.lastUpdated = model.lastUpdated;
        return dto;
    }
}

export class RulePropertyModelMgr {
    rulePropertyModelList : RulePropertyModel[] = [];
    init(domPage : any) {
      for (let dom of domPage) {
        const model = RulePropertyModel.toRulePropertyModel(dom);
        this.rulePropertyModelList.push(model);
      }
    }

    getRulePropertyModelList() {
        return this.rulePropertyModelList;
    }

    _getAllDataPoints() {
        let dataPoints : Datapoint[] = [];
        for(let i = 0; i < this.rulePropertyModelList.length; i++) {
            dataPoints.push(RulePropertyModel.createDatapoint(this.rulePropertyModelList[i]));
        }
        return dataPoints;
    }
}