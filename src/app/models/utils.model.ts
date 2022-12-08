import { now } from "jquery";

export class DateRange {
    startDate : Date = new Date();
    endDate : Date = new Date();
  
    updateStartDate(days:number) {
        this.startDate.setDate(this.startDate.getDate() - days);
    }

    getStartDateAsIso() {
         return DateRange.getDateAsIso(this.startDate);
    }

    getEndDateAsIso() {
        return DateRange.getDateAsIso(this.endDate);
    }
   
    static getDateAsIso(date : Date) {
        return date.toISOString().slice(0, 10);
    }
  
    static createDataRange(days:number) {
        let dateRange = new DateRange();
        dateRange.updateStartDate(days);
        return dateRange;
    }
}

export class StrDateRange {
    startDate : String;
    endDate : String;
  
   
    static createDataRange(days:number) {
        let dateRange = new DateRange();
        dateRange.updateStartDate(days);
        let strDateRange = new StrDateRange();
        strDateRange.startDate = dateRange.getStartDateAsIso();
        strDateRange.endDate = dateRange.getEndDateAsIso();
        return strDateRange;
    }
}

export class StringUtils {
    static stringToArray(src : String, delimter : string) {
        const strArray = src.split(delimter);
        return strArray;
    }
  
    static stringArrayToString(srcArray : String[], seperator : string) {
        const str = srcArray.join(seperator);
        return str;
    }
    
    static dateArrayToString(srcArray : Date[], seperator : string) {
        let strDates = "";
        if (srcArray) {
            strDates = srcArray.join(seperator);
        }
        return strDates;
    }

    static stringToDateArray(src : String, delimter : string) {
        const strArray = src.split(delimter);
        let dateArray :Date[] = [];
        for(let i = 0; i < strArray.length; i++) {
            dateArray.push(new Date(strArray[i]));
        }
        return dateArray;
    }
}