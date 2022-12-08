import { colorSets } from "@swimlane/ngx-charts";
import { RuleAssetModel } from "../views/admin/rule-engine/models/rule-asset-map.model";
import { Organization } from "./organization.model";

export const ALL = "All";

export enum RealtimeValueEnum {
    belowRange=0,
    withinRange,
    aboveRange,
    unKnownRange
}

export enum RealtimeValueColor {
    green="#00aa00",
    amber="#ffbf00",
    red="#cc0000",
    //yellow="#ffff00",
    defaultColor="#ffffff"
}

export class DomainType {
    static All : string = "All";
    static TRANSACTIONAL : string = "TRANSACTIONAL";
    static ANALYTICAL : string="ANALYTICAL";
    static MASTERCONFIG : string = "MASTERCONFIG";
    static ASSET : string = "ASSET";
}

export class Domain {
    id: string;
    entityName: string; // not null
    entityDescription: string;
    owner: string;
    domainType: string; // not null
    isActive: boolean;
    schemaDefinition: string;
    schemaDefinitionContentType: string;
    rawFile: string;
    defaultOrganizationId: string;
    defaultOrganization: string;
    rawFileContentType: string;
    createdBy: string;
    createdOn: Date;
    childDomains: Domain[]; // we need to fix this properly.
    company: Organization;
    domainAttributes:DomainAttribute[];
    companyId: string;

    static domainTypes = [DomainType.All,DomainType.TRANSACTIONAL, DomainType.ANALYTICAL, DomainType.MASTERCONFIG, DomainType.ASSET];
    static getDomainTypes(){
       return Domain.domainTypes;
    }

    static domaintypeList = [
        { domaintypeid: 1, name: DomainType.TRANSACTIONAL },
        { domaintypeid: 2, name: DomainType.ANALYTICAL },
        { domaintypeid: 3, name: DomainType.MASTERCONFIG },
        { domaintypeid: 4, name: DomainType.ASSET }
    ];

    static getDomainTypesFromStringArray(strArray : String[]) {

        let dTypes = [];

        for(let i = 0; i <strArray.length; i++ ) {
            switch(strArray[i]) {
            case  DomainType.TRANSACTIONAL:
                dTypes.push({ domaintypeid:1, name: DomainType.TRANSACTIONAL });
            break;
            case  DomainType.ANALYTICAL:
                dTypes.push({ domaintypeid:2, name: DomainType.ANALYTICAL });
            break;
            case  DomainType.MASTERCONFIG:
                dTypes.push({ domaintypeid:3, name: DomainType.MASTERCONFIG });
            break;
            case  DomainType.ASSET:
                dTypes.push({ domaintypeid:4, name: DomainType.ASSET });
            break;
            }
        }
        return dTypes;

    }

    static getDomainTypeIds(domainTypeList : any[]) {
        let domainTypeIds:string[] = [];
        for(let i = 0; i <domainTypeList.length; i++ ) {
            domainTypeIds.push(domainTypeList[i].name);
        }
        return domainTypeIds;

    }

    static getDomainIds(domainList : Domain[]) {
        let domainIds:string[] = [];
        for(let i = 0; i < domainList.length;i++) {
            domainIds.push(domainList[i].id);
        }
        return domainIds;
    }


    updateDomainAttributes(dom: any) {
        this.domainAttributes = Domain.createDomainAttributes(dom);
    }

    getDomainAttributes() {
        return this.domainAttributes;
    }

    getIsIndexed(attributeName:string) {
        let isIndexedAttributes = this.getIsIndexedAttributes();
        return isIndexedAttributes.indexOf(attributeName) >=0;
    }

    getAttribute(attributeName:string) {
        let das = this.domainAttributes;
        let temp : string = "";
        for(let i = 0;i < das.length; i++) {
           if (das[i].checkName(attributeName)) {
               return das[i];
           }
           else {
            temp += das[i].attributeName + ", ";
           }
        }
        console.log(attributeName + ' - getAttribute ' + temp);
        return null;
    }
    
    getIsIndexedAttributes() {
        let isIndexedAttributes = new Array<string>();
        for(let i = 0;i < this.domainAttributes.length; i++) {
            if (this.domainAttributes[i].isIndexed) {
                if (isIndexedAttributes.indexOf(this.domainAttributes[i].attributeName) < 0) {
                    isIndexedAttributes.push(this.domainAttributes[i].attributeName)
                }
            }
        }
        return isIndexedAttributes;
    }

    applyDomain(rp : RealtimeParameter) {
        let da = this.getAttribute(rp.name);
        if (da != null) {
            rp.color = RealtimeValueColor.defaultColor;
            rp.isIndexed = da.isIndexed > 0;
            rp.realtimeValueEnum = da.getRealtimeValueEnum(rp.value);
            switch(rp.realtimeValueEnum){
            case RealtimeValueEnum.belowRange:
                rp.color = RealtimeValueColor.amber;
                break;
            case RealtimeValueEnum.withinRange:
                rp.color = RealtimeValueColor.green;
                break;
            case RealtimeValueEnum.aboveRange:
                rp.color = RealtimeValueColor.red;
                break;
            case RealtimeValueEnum.unKnownRange:
                rp.color = RealtimeValueColor.defaultColor;
                break;
            }
        }
        else {
            console.log(rp.name + ' - applyDomain failed');
        }
        return rp;
    }

    
  
    static create(dom: any) {
        let domain = new Domain();
        domain.id = dom.id;
        domain.entityName= dom.entityName;
        domain.entityDescription= dom.entityDescription;
        domain.owner= dom.owner;
        domain.domainType=dom.domainType;
        domain.schemaDefinition=dom.schemaDefinition;
        domain.schemaDefinitionContentType=dom.schemaDefinitionContentType;
        domain.rawFile=dom.rawFile;
        domain.rawFileContentType=dom.rawFileContentType;
        domain.isActive= dom.isActive;
        domain.childDomains = dom.childDomains;
        domain.domainAttributes = Domain.createDomainAttributes(dom.domainAttributes);
        return domain;
    }

    static createDomainAttributes(attributes: any[]) {
        let domainAttributes = new Array<DomainAttribute>();
        for(let i = 0;i < attributes.length; i++) {
            domainAttributes.push(DomainAttribute.create(attributes[i]));
        }
        return domainAttributes;
    }

}

export class DomainAttribute {
    id:number;
    attributeName : string;
    attributeType : string;
    attributeLength : Number;
    attributeDescription : string;
    allowNull : Number;
    columnType : String;
    isUnique : Number;
    isIndexed : Number;
    isForeignKey : Number;
    min:string;
    max:string;
    threshold:string;
    domainId : Number;
   
    checkName(name:string) {
        return (this.attributeName.toUpperCase() === name.toUpperCase());
    }

    /*
    Green: If the value from Cassandra is within Min / Max 
	Amber: If the value from Cassandra is between Warning Threshold (Min – Threshold or Max + Threshold)
	Red: If the value from Cassandra is between Critical Threshold (Min – Threshold or Max + Threshold)
    */

    getRealtimeValueEnum(value:string) {
        let rt = RealtimeValueEnum.unKnownRange;
        try {
            let nThreshold = Number.parseFloat(this.threshold);
            let nValue = Number.parseFloat(value);
            let nMin = Number.parseFloat(this.min) - nThreshold;
            let nMax = Number.parseFloat(this.max) + nThreshold;
          
            if (nValue >= nMin && nValue <=nMax ) {
                rt = RealtimeValueEnum.withinRange;
            }
            else if (nValue > nMax ) {
                rt = RealtimeValueEnum.aboveRange;
            }
            else if (nValue < nMin ) {
                rt = RealtimeValueEnum.belowRange;
            }
            return rt;
        }
        catch(err) {
        }
        return rt;
    }

    static create(attribute : any) {
        let domainAttribute = new DomainAttribute();
        domainAttribute.id = attribute.id;
        domainAttribute.attributeName = attribute.attributeName;
        domainAttribute.attributeType = attribute.attributeType;
        domainAttribute.attributeLength = attribute.attributeLength;
        domainAttribute.attributeDescription = attribute.attributeDescription;
        domainAttribute.allowNull = attribute.allowNull;
        domainAttribute.columnType = attribute.columnType;
        domainAttribute.isUnique = attribute.isUnique;
        domainAttribute.isIndexed = attribute.isIndexed;
        domainAttribute.isForeignKey = attribute.isForeignKey;
        domainAttribute.domainId = attribute.domainId;
        domainAttribute.min = attribute.min;
        domainAttribute.max = attribute.max;
        domainAttribute.threshold = attribute.threshold;
        return domainAttribute;
    }
}

export class IdAndName {
    id: String;
    name: String;
    constructor() {
    }
}

export class IdAndNameList {
    idAndNames : IdAndName[];
    constructor() {
    }
    
    initWithDomains(domains:Domain[]) {
        let tIdNames=[];
        for(let i = 0; i < domains.length; i++) {
            tIdNames.push({id:domains[i].id, name:domains[i].entityName})
        }
        this.idAndNames = tIdNames;
    }

    getAll() {
        return this.idAndNames; 
    }

    getAllExclue(id:String) {
        let tIdNames : IdAndName[] = this.idAndNames;
        for(let i = 0; i < tIdNames.length; i++) {
            if ((tIdNames[i].id === id)) {
                var delObject = tIdNames.splice(i,1);
                delObject = null;
                break;
            }
        }
        return tIdNames;
    }
}


export class DomainDataMgr {
    domainDataList = new Array<Domain>();
    domainIdList = new Array<string>();
    isIndexedList = new Array<string>();
    constructor() {

    }
    
    init(domList : any) {
      let tList = domList;
      for(let i = 0; i < tList.length; i++) {
        let domain = Domain.create(tList[i]);
        this.domainIdList.push(domain.id);
        this.domainDataList.push(domain);
        this.updateIsIndexedList(domain.getIsIndexedAttributes());
      }
   }

    updateIsIndexedList(isIndexedList : string[]) {
        for(let i = 0; i < isIndexedList.length; i++) {
            if (this.isIndexedList.indexOf(isIndexedList[i]) < 0 ) {
                this.isIndexedList.push(isIndexedList[i]);
            }
        }
    }

    getDomainDataList() {
        return this.domainDataList;
    }

    getDomainIdList() {
        return this.domainIdList;
    }

    getIsIndexedAttributes() {
        return this.isIndexedList;
    }

    getDomainNameList() {
        let assetNameList = new Array<String>();
         for(let i = 0; i < this.domainDataList.length; i++) {
            assetNameList.push(this.domainDataList[i].entityName);
         }
         return assetNameList;
    }


    getAssetsByDomainType(domainType:string) {
        let assetIDList = new Array<String>();
        for(let i = 0; i < this.domainDataList.length; i++) {
            if (domainType === ALL) {
                assetIDList.push(this.domainDataList[i].id.toString());
            }
            else
            if (this.domainDataList[i].domainType === domainType) {
                assetIDList.push(this.domainDataList[i].id.toString());
            }
        }
        return assetIDList;
    }

     getAssetIdsById(id:string) {
        let assetIDList = new Array<String>();
         for(let i = 0; i < this.domainDataList.length; i++) {
             if (this.domainDataList[i].id.toString() === id) {
                 assetIDList.push(this.domainDataList[i].id.toString());
             }
         }
         return assetIDList;
    }

    getAssetIdsByName(name:string) {
        let assetIDList = new Array<String>();
         for(let i = 0; i < this.domainDataList.length; i++) {
             if (this.domainDataList[i].entityName === name) {
                 assetIDList.push(this.domainDataList[i].id.toString());
             }
         }
         return assetIDList;
    }

    getAssetById(id:string) {
        let assetIDList = new Array<String>();
        for(let i = 0; i < this.domainDataList.length; i++) {
            if (this.domainDataList[i].id.toString() === id) {
                return this.domainDataList[i];
            }
        }
        return null;
    }

    getAssetsByIsIndexed(attributeName:string) {
        let assetIDList = new Array<String>();
        for(let i = 0; i < this.domainDataList.length; i++) {
            if (this.domainDataList[i].getIsIndexed(attributeName)) {
                assetIDList.push(this.domainDataList[i].id.toString());
            }
        }
        return assetIDList;
    }

    getAssetsByIds(ids:string[]) {
        let selectedDomains = new Array<Domain>();
        for(let i = 0; i < this.domainDataList.length; i++) {
            let index = ids.indexOf(this.domainDataList[i].id.toString());
            let index2 = ids.indexOf(this.domainDataList[i].id);
            if (index >=0 || index2 >=0 ) {
                selectedDomains.push(this.domainDataList[i]);
            }
        }
        return selectedDomains;
    }

    getRuleAssetModelList(ids:string[]) {
        let ruleAssetModelList = new Array<any>();
        for(let i = 0; i < this.domainDataList.length; i++) {
            if (ids.indexOf(this.domainDataList[i].id.toString()) >=0) {
                let rAM  =  {
                    assetId: this.domainDataList[i].id,
                    assetSerialNumber: this.domainDataList[i].entityName,
                    assetType: this.domainDataList[i].domainType,
                } as RuleAssetModel;
                ruleAssetModelList.push(rAM);
            }
        }
        return ruleAssetModelList;
    }
  }

export class RealtimeParameter {
    name: string;
    value: string;
    node: string;
    status: string;
    isIndexed : boolean =  false; // not comes form the realtime data
    color:string = "#ffffff";
    ts:string = "";
    selected:boolean=false;
    realtimeValueEnum : RealtimeValueEnum = RealtimeValueEnum.unKnownRange;
    setIsIndexed(flag:boolean) {
       this.isIndexed = flag;
    }
    getIsIndexed() {
        return this.isIndexed
    }

    checkName(name:string) {
        return (this.name === name);
    }
    setSelection(bSelection:boolean) {
        this.selected = bSelection;
    }
    static create(json: any, ts : string) {
        let parameter = new RealtimeParameter();
        parameter.name = json.name;
        parameter.value = json.value;
        parameter.node = json.node;
        parameter.status = json.status;
        parameter.ts = ts;
        return parameter;
    }
   
    static createEx(json: any, ts : string, domain:Domain) {
        let parameter = new RealtimeParameter();
        parameter.name = json.name;
        parameter.value = json.value;
        parameter.node = json.node;
        parameter.status = json.status;
        parameter.ts = ts;
        parameter = domain.applyDomain(parameter);
        return parameter;
    }
}