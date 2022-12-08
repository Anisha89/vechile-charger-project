import { Component, OnInit,  ViewChild} from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetDashboardServiceNew } from '../assetdashboard.service';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { DomainService } from '../../../../services/domain-service';
import { Domain, RealtimeParameter } from '../../../../models/domain.model';
import { RealtimeAsset, RealtimeAssetMgr, RealtimeParameterList } from '../../../../models/realtimeasset.model';
import { AssetAlarm, AssetAlarmMgr } from '../../../../models/assetalarm.model';
import { Organization } from '../../../../models';
import { ChartInputData, AssetChartMgr,  ChartUIData} from '../../../../models/assetchart.model';
import { PaginationService } from '../../../../component/pagination';

import { DatePipe } from '@angular/common';
import { BROWSER_GLOBALS_PROVIDERS } from '@agm/core/utils/browser-globals';
import { StrDateRange } from '../../../../models/utils.model';

@Component({
    selector: 'app-assetdashboard',
    templateUrl: 'assetdashboard.component.html',
    styleUrls: ['assetdashboard.component.scss']
})

export class AssetDashboardComponentNew implements OnInit {
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap
    @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
    isLoading=false;
    allasset:[];
    totalPage:any;
    selectedValue:any;
    image:any;
    orgimg:any;
    alarmdata:any;
    realtimeAssetMgr=new RealtimeAssetMgr();
    assetAlarmMgr=new AssetAlarmMgr();
    //selectedchartType="Bar";
    alarmList:any;
    isChecked:any;
    
    center: google.maps.LatLngLiteral
    options: google.maps.MapOptions = {
        zoomControl: true,
         disableDoubleClickZoom: true,
        mapTypeId: 'terrain',
        maxZoom: 12,
        minZoom: 8,
    }
    //date: Date = new Date();
     assetImageUrl :String = "";
    domainType:String="";
    lastUpdatedTime:String="";
   realTimeAsset :RealtimeAsset;
    domain : Domain;
    marker : any; // MapMarker
    realtimedata = new  Array<RealtimeParameter>();
    realtimedataList = new  Array<RealtimeParameter>();
    currentOrganization: Organization;
    assetAlarmStatusList :string[] = AssetAlarm.assetAlarmStatus;
    assetAlarmSeverityList :string[] = AssetAlarm.assetAlarmSeverity;
    chartIntervalList:string[]=ChartInputData.intervals;
    chartTypeList:string[]=ChartInputData.chartTypes;
    assetChartMgr = new AssetChartMgr();
    chartInputData : ChartInputData;
    chartUIData:ChartUIData;
    assetChartDataList : any =undefined;
    pageSizeAlarm:Number=5;
    pageSizeRealtime:Number=5;
    isIndexedList=[];

    alarmDateRange : StrDateRange;
   
 
    constructor(
      private datePipe: DatePipe,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute,
        private service:AssetDashboardServiceNew,
        private assetService:DomainService,
       
        
    ) {}
   
  ngOnInit() {
    this.alarmDateRange = StrDateRange.createDataRange(30);
    this.currentOrganization = this.context.get('current-organization');
    this.domain = this.context.get('fixed-asset');
    this.marker = this.context.get('selected-marker');
    this.isIndexedList = this.context.get('is-indexed-list');
    this.initializeStartAndEndDates();
   
    this.chartUIData = this.assetChartMgr.getChartUIData();
    this.chartIntervalList = this.chartInputData.getchartintervals();
    this.chartTypeList = this.chartInputData.getchartTypes();
    this.getFixedAsset();
  }
 
  getFixedAsset() {
    this.isLoading = true;
    this.assetService.get(this.domain.id).subscribe(obj => {
      let tDomain = Domain.create(obj);
      this.domain = tDomain;
      this.getRealTimeAsset();
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
}

getRealTimeAsset() {
    this.isLoading = true;
    this.service.getRealTimeAssetById(this.domain.id).subscribe(rtAsset => {
      //this.realTimeAsset = RealtimeAsset.create(rtAsset);
      this.realTimeAsset = RealtimeAsset.createEx(rtAsset,this.domain);
    //  this.realTimeAsset.applyIsIndexed(this.isIndexedList);
      this.realtimedata = this.realTimeAsset.getRealTimeAttributes();
      this.copyToRealtimeDataList();
      this.center = {
        lat: Number.parseFloat(this.realTimeAsset.latitude),
        lng: Number.parseFloat(this.realTimeAsset.longitude)
      }
      this.marker.position.lat = this.center.lat;
      this.marker.position.lng = this.center.lng;
      this.assetImageUrl = "assets/img/car.jpg";  // need to fixed properly to show the image
      this.domainType = this.domain.domainType;
      this.lastUpdatedTime = this.realTimeAsset.occurrenceDatetime;
      this.getRealTimeAlarms();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
}

postForLatestRealTimeAsset() {
    this.isLoading = true;
    let limitParams = {"limit":5};
    this.service.postForLatestRealTimeAsset(this.domain.id, limitParams).subscribe(rtAsset => {
      //this.realTimeAsset = RealtimeAsset.create(rtAsset);
      this.realTimeAsset = RealtimeAsset.createEx(rtAsset,this.domain);
    //  this.realTimeAsset.applyIsIndexed(this.isIndexedList);
      this.realtimedata = this.realTimeAsset.getRealTimeAttributes();
      this.copyToRealtimeDataList();
      this.center = {
        lat: Number.parseFloat(this.realTimeAsset.latitude),
        lng: Number.parseFloat(this.realTimeAsset.longitude)
      }
      this.marker.position.lat = this.center.lat;
      this.marker.position.lng = this.center.lng;
      this.assetImageUrl = "assets/img/car.jpg";  // need to fixed properly to show the image
      this.domainType = this.domain.domainType;
      this.lastUpdatedTime = this.realTimeAsset.occurrenceDatetime;
      this.getRealTimeAlarms();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.log(error);
    });

}

getRealTimeAlarms() {
  this.isLoading = true;
    this.service.getRealTimeAlarmsByAssetId(this.domain.id).subscribe(domPage => {
      let domLst = []
      for(let dom of domPage?.content) {
        domLst.push(dom);
      }
      this.alarmList=[];
      this.assetAlarmMgr = new AssetAlarmMgr();
      this.assetAlarmMgr.init(domLst);
      this.alarmdata = this.assetAlarmMgr.getAssetAlarmList();
      this.copyToAlarmList();
      this.isLoading = false;
  }, error => {
    this.isLoading = false;
    console.log(error);
  });
}

postForRealTimeAlarmsByDateRange() {
  this.isLoading = true;
  ////Sample: { "assetId","38", "fromDate":"2021-07-01", "toDate":"2021-07-06" }
  let alarmParams ={ "assetId": this.domain.id, "fromDate": this.alarmDateRange.startDate, "toDate": this.alarmDateRange.endDate };
    this.service.postForRealTimeAlarmsByDateRange(this.domain.id, alarmParams).subscribe(domPage => {
      let domLst = []
      for(let dom of domPage?.content) {
        domLst.push(dom);
      }
      this.alarmList=[];
      this.assetAlarmMgr = new AssetAlarmMgr();
      this.assetAlarmMgr.init(domLst);
      this.alarmdata = this.assetAlarmMgr.getAssetAlarmList();
      this.copyToAlarmList();
      this.isLoading = false;
  
  }, error => {
    this.isLoading = false;
    console.log(error);
  });
}

  displayalarmData(selPageDataList) {
    this.alarmList = selPageDataList;
  }

  displayrealtimeData(selPageDataList) {
    this.realtimedataList = selPageDataList;
    this.realtimedataList = this.chartInputData.updateSelection(this.realtimedataList);
  }

  onSelect(data): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onAssetAlarmDateListChange() {
    this.postForRealTimeAlarmsByDateRange();
  }

  onAssetAlarmSeverityChange(severity :string) {
    if (severity) {
      this.alarmdata = this.assetAlarmMgr.getAssetAlarmListBySeverity(severity);
      this.copyToAlarmList();
    }
  }
 
  
  onAssetAlarmStatusChange(status :string) {
    if (status) {
      this.alarmdata = this.assetAlarmMgr.getAssetAlarmListByStatus(status);
      this.copyToAlarmList();
    }
  }

  copyToAlarmList() {
    // needs to be fixed properly for this.alarmList.length  part, need to know total rows in a page.
    //let rowsPerPage = this.alarmList.length < this.alarmdata.length ? this.alarmList.length : this.alarmdata.length;
    let rowsPerPage = this.pageSizeAlarm < this.alarmdata.length ? this.pageSizeAlarm : this.alarmdata.length;
    this.alarmList=[];
    for( let i = 0; i < rowsPerPage; i++ ) {
      this.alarmList.push(this.alarmdata[i]);
    }
  }

  copyToRealtimeDataList() {
    let rowsPerPage = this.pageSizeRealtime < this.realtimedata.length ? this.pageSizeRealtime : this.realtimedata.length;
    this.realtimedataList=[];
    for( let i = 0; i < rowsPerPage; i++ ) {
      this.realtimedataList.push(this.realtimedata[i]);
    }
  }

   onChange(e: any, name: string) {
    if (e.target.checked) {
      console.log(name + 'Checked');
      this.chartInputData.addParam(name);
    }
    else {
      console.log(name + 'unchecked');
      this.chartInputData.removeParam(name);
    }
  }
  
  onchangeInterval(interval: string) {
    this.chartInputData.updateInterval(interval);
  }
   
   onchangechartType(type:string) {
    this.chartInputData.updateChartType(type);
  }

  initializeStartAndEndDates() {
    let lastmonth = new Date();
    lastmonth.setDate(lastmonth.getDate() - 30);
    let fromDate = this.datePipe.transform(lastmonth, 'yyyy-MM-dd');
    let toDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.chartInputData = new ChartInputData(this.domain.id, fromDate, toDate, 7 , "Bar");
  }

  submitChartReqInfo() {
    this.getAssetChartDetails(this.chartInputData.getAsJson());
  }

  getAssetChartDetails(jsonChartInputData) {
     this.isLoading = true;
       this.service.assetChartReq(jsonChartInputData).subscribe(domPage => {
         let domLst = []
         for(let dom of domPage.output) {
           domLst.push(dom);
         }
         this.assetChartMgr = new AssetChartMgr();
         this.assetChartMgr.init(domLst);
         this.assetChartDataList = this.assetChartMgr.getAssetChartItemList();
         this.isLoading = false;
     }, error => {
       this.isLoading = false;
       console.log(error);
     });
  }
}