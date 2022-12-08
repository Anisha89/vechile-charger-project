import { Domain, RealtimeValueEnum, RealtimeParameter } from "./domain.model";
import { LocationData } from "./locationdata.model";


export class RealtimeParameterList {
    ts: string;
    param = new Array<RealtimeParameter>();
    constructor(ts:string) {
        this.ts = ts;
    }
    add(param : RealtimeParameter) {
        this.param.push(param);
    }
   
    applyIsIndexed(isIndexedAttributes : string[]) {
        for(let i= 0; i < this.param.length; i++) {
            if (isIndexedAttributes.indexOf(this.param[i].name) >= 0) {
                this.param[i].setIsIndexed(true);
            }
        }
    }

    getIsIndexedAttributeNames() {
        let filter = Array<string>();
        for(let i= 0; i < this.param.length; i++) {
            if (this.param[i].getIsIndexed()) {
                if(filter.indexOf(this.param[i].name) < 0) {
                    filter.push(this.param[i].name)
                }
            }
        }
        return filter;
    }

    getAttributes() {
        return this.param;
    }
   
    static create(jsonList: any) {
        let obj = new RealtimeParameterList(jsonList.ts);
        let items = jsonList.param;
        for(let i = 0; i < items.length; i++) {
            let param = RealtimeParameter.create(items[i],jsonList.ts);
            obj.add(param);
        }
        return obj;
    }

    static createEx(jsonList: any,domain : Domain) {
        let obj = new RealtimeParameterList(jsonList.ts);
        let items = jsonList.param;
        for(let i = 0; i < items.length; i++) {
            let param = RealtimeParameter.createEx(items[i],jsonList.ts, domain);
            obj.add(param);
        }
        return obj;
    }
}

export class RealtimeAsset {
    assetId: string;
    controllerId: string;
    occurrenceDatetime: string;
    latitude: string;
    longitude: string;
    sentDateTime:string;
    snapshot : RealtimeParameterList;


    add(snapshot: RealtimeParameterList) {
        this.snapshot = snapshot;
    }
   
    applyIsIndexed(isIndexedAttributes : string[]) {
      
            this.snapshot.applyIsIndexed(isIndexedAttributes);
    }

    getIsIndexedAttributeNames() {
        let all = Array<string>();
            let filter = this.snapshot.getIsIndexedAttributeNames();
            for(let j =0; j< filter.length; j++) {
                if(all.indexOf(filter[j]) < 0) {
                    all.push(filter[j])
                }
            }
         return all;
    }

    getRealTimeAttributes() {
        let subsets = this.snapshot.getAttributes();
        return subsets;
    }

    getIsIndexAttributesAsHtmlTable() {
        let realtimeAttributes = this.getRealTimeAttributes();
        let realtimeAttributesNames = new Array<string>();
        let strRealTimeNameValueRows : string = "";
        for(let i = 0; i < realtimeAttributes.length; i++) {
            if (realtimeAttributes[i].isIndexed && realtimeAttributesNames.indexOf(realtimeAttributes[i].name) < 0) {
              let rtvRow = "<p><b>" + realtimeAttributes[i].name + " : " + realtimeAttributes[i].value+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b></p>";
              strRealTimeNameValueRows += rtvRow;
              realtimeAttributesNames.push(realtimeAttributes[i].name);
            // //this is for testing
            //   for(let j = 0; j< 9; j++) {
            //    strRealTimeNameValueRows += rtvRow;
            //   }
            }
        }
        return strRealTimeNameValueRows
    }
 
    static create(json: any) {
        let realtimeAsset = new RealtimeAsset();
        realtimeAsset.assetId = json.assetId;
        realtimeAsset.controllerId= json.controllerId;
        realtimeAsset.occurrenceDatetime= json.occurrenceDatetime;
        realtimeAsset.latitude= json.latitude;
        realtimeAsset.longitude=json.longitude;
        realtimeAsset.sentDateTime=json.sentDateTime;

        let param = RealtimeParameterList.create(json.snapshot);
        realtimeAsset.add(param);
        /*
        let snapshots = RealtimeAsset.applyCorrection(json.snapshots);
        if (snapshots) {
            for(let i = 0; i < snapshots.length; i++) {
                let param = RealtimeParameterList.create(snapshots[i]);
                realtimeAsset.add(param);
            }
        }
        */
        return realtimeAsset;
    }

    static applyCorrection(snapshotsString: String) {
        let tempString = snapshotsString.replace('\"','"');
        let jsonarray=JSON.parse(tempString);
        return jsonarray;
    }

    // appy min and max

    static createEx(json: any, domain : Domain) {
        let realtimeAsset = new RealtimeAsset();
        realtimeAsset.assetId = json.assetId;
        realtimeAsset.controllerId= json.controllerId;
        realtimeAsset.occurrenceDatetime= json.occurrenceDatetime;
        realtimeAsset.latitude= json.latitude;
        realtimeAsset.longitude=json.longitude;
        realtimeAsset.sentDateTime=json.sentDateTime;
        let param = RealtimeParameterList.createEx(json.snapshot, domain);
        realtimeAsset.add(param);
        /*
        let snapshots = RealtimeAsset.applyCorrection(json.snapshot);
        if (snapshots) {
            for(let i = 0; i < snapshots.length; i++) {
                let param = RealtimeParameterList.createEx(snapshots[i], domain);
                realtimeAsset.add(param);
            }
        }
        */
        return realtimeAsset;
    }
}


export class RealtimeAssetMgr {
    realtimeAssetList = new Array<RealtimeAsset>();
    realtimeAssetIDList = new Array<string>();
    realtimeAssetLocationList = new Array<LocationData>();

    constructor() {
    }

    add(realtimeAsset:RealtimeAsset) {
        this.realtimeAssetList.push(realtimeAsset);
        if (this.realtimeAssetIDList.indexOf(realtimeAsset.assetId) < 0) {
            this.realtimeAssetIDList.push(realtimeAsset.assetId);
            let lData = new LocationData(realtimeAsset.assetId, realtimeAsset.assetId, Number.parseFloat(realtimeAsset.latitude), Number.parseFloat(realtimeAsset.longitude))
            this.realtimeAssetLocationList.push(lData);
        }
    }
    
    init(domList : any) {
      let tList = domList;
      for(let i = 0; i < tList.length; i++) {
        let realtimeAsset = RealtimeAsset.create(tList[i]);
        this.add(realtimeAsset);
      }
    }



    applyIsIndexed(isIndexedAttributes : string[]) {
        for(let i= 0; i < this.realtimeAssetList.length; i++) {
            this.realtimeAssetList[i].applyIsIndexed(isIndexedAttributes);
        }
    }
    

    getRealTimeAsset(id : string) {
        for(let i= 0; i < this.realtimeAssetList.length; i++) {
            if (this.realtimeAssetList[i].assetId === id) {
                return this.realtimeAssetList[i];
            };
        }
        return null;
    }
    getRealtimeIsIndexedList() {
        let all = Array<string>();
        for(let i= 0; i < this.realtimeAssetList.length; i++) {
            let filter = this.realtimeAssetList[i].getIsIndexedAttributeNames();
            for(let j =0; j< filter.length; j++) {
                if(all.indexOf(filter[j]) < 0) {
                    all.push(filter[j])
                }
            }
        }
        return all;
    }

    getRealtimeAssetList() {
        return this.realtimeAssetList;
    }

    getRealtimeAssetIDList() {
        return this.realtimeAssetIDList;
    }
   
    getRealtimeAssetLocationList() {
      return this.realtimeAssetLocationList;
    }
}

// Sample Data
/*
[
    {
        "ts": "2016-09-12 16:57:14.000Z",
        "param": [
            {
                "Name": "Electric Potential(Voltage)",
                "Value": "14.00",
                "node": "49",
                "staus": "OK"
            },
            {
                "Name": "Fuel Level 1",
                "Value": "90.40",
                "node": "49",
                "staus": "OK"
            }
        ]
    },
    {
        "ts": "2016-09-12 16:57:14.000Z",
        "param": [
            {
                "Name": "Electric Potential(Voltage)",
                "Value": "14.00",
                "node": "49",
                "staus": "OK"
            },
            {
                "Name": "Fuel Level 1",
                "Value": "90.40",
                "node": "49",
                "staus": "OK"
            }
        ]
    }
]
*/