import { DagreSettings } from "@swimlane/ngx-graph";
import { reduce } from "rxjs/operators";

export class AssetAlarm {
    controllerId: string;
    assetId: string;
    severity: string;
    message: string;
    status: string;
    comments: string;
    date_time: string;
    date:string; // 
    
    static create(json: any) {
        let alarm = new AssetAlarm();
        alarm.controllerId = json.controllerId;
        alarm.assetId = json.assetId;
        //alarm.severity = json.severity;
        alarm.severity = json.severity.charAt(0).toUpperCase() + json.severity.slice(1);
        alarm.message = json.message;
        //alarm.status = json.status;
        alarm.status = json.status.charAt(0).toUpperCase() + json.status.slice(1) ;
        alarm.comments = json.comments;
        alarm.date_time = json.date_time.trim();
        alarm.date =  alarm.date_time.substring(0,10);
        return alarm;
    }

    getDate() {
        return this.date;
    }

    checkDate(filterDate:string) {
        return (this.getDate() === filterDate);
    }
    
    // severity
    static assetAlarmSeverity:string[] = ["All","Critical","Warning"];
    static getAssetAlarmSeverity() {
        return AssetAlarm.assetAlarmSeverity;
    }
    // status
    static assetAlarmStatus:string[] = ["All","Open","Closed","Addressed","Deferred"];
     static getAssetAlarmStatus() {
        return AssetAlarm.assetAlarmStatus;
    }
   
}


export class AssetAlarmMgr {
    assetAlarmList = new Array<AssetAlarm>();
    constructor() {
    }

    add(assetAlarm:AssetAlarm) {
        this.assetAlarmList.push(assetAlarm);
    }

    init(jsons : any) {
        let tList = jsons;
        for(let i = 0; i < tList.length; i++) {
            let realtimeAsset = AssetAlarm.create(tList[i]);
            this.add(realtimeAsset);
        }
    }

    getAssetAlarmListByStatus(status:string) {
        let alarmList = new Array<AssetAlarm>();
        for(let i = 0; i < this.assetAlarmList.length; i++) {
            if (status === "All") {
                return this.getAssetAlarmList();
            }
            else if (status === this.assetAlarmList[i].status) {
                alarmList.push(this.assetAlarmList[i]);
            }
        }
        return alarmList;
    }

   getAssetAlarmListBySeverity(severity:string) {
        let alarmList = new Array<AssetAlarm>();
        for(let i = 0; i < this.assetAlarmList.length; i++) {
            if (severity === "All") {
                return this.getAssetAlarmList();
            }
            else if (severity === this.assetAlarmList[i].severity) {
                alarmList.push(this.assetAlarmList[i]);
            }
        }
       // this.getbackgroudcolor(severity);
        return alarmList;

    }
    getSeveritybackgroudcolor(severity:string) {
        
         
       
       
    }

    getStatusbackgroudcolor(status:string) {
        
    }

    getAssetAlarmDateList() {
        let dateList = new Array<string>();
        dateList.push("All");
        for(let i = 0; i < this.assetAlarmList.length; i++) {
            let strDate = this.assetAlarmList[i].getDate();
            if (dateList.indexOf(strDate) < 0) {
                dateList.push(strDate);
            }
        }
        return dateList;
    }

    getAssetAlarmListByDate(dateYYYYMMDD:string,date1YYYYMMDD:string) {
      /*  if (dateYYYYMMDD === "All") {
            return this. getAssetAlarmList();
        }
        let alarmList = new Array<AssetAlarm>();
        for(let i = 0; i < this.assetAlarmList.length; i++) {
            if (this.assetAlarmList[i].checkDate(dateYYYYMMDD)) {
                alarmList.push(this.assetAlarmList[i]);
            }
           
        }
        return alarmList;*/
    }


   
    getAssetAlarmList() {
        return this.assetAlarmList;
    }
}