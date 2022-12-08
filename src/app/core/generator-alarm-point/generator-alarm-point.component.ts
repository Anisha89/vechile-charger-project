import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { GeneratorAlarmStatus, GenAssetTableShrinkView } from './../../app-common';
import { Subject } from 'rxjs/Subject';
import { Socket } from 'ng-socket-io';
import { Router } from '@angular/router';
import * as moment from 'moment';
import {AppService} from "../../app.service";
import * as _ from 'underscore';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-generator-alarm-point',
  templateUrl: './generator-alarm-point.component.html',
  styleUrls: ['./generator-alarm-point.component.scss']
})
export class GeneratorAlarmPointComponent implements OnInit, OnDestroy {


  @Input() assetAlarmInfo: any;

  @Input() selectedRealTimeData: string[];

  @Input() getGenAssetAlaramInfo : any[]=[] ;
  public getGenAssetAlaramInfoo : any[]=[] ;
  @Input() numberRowPerPage : number;

  private selectedView = true;
  public toggleFilterSearch = false;
  public keyUp = new Subject<string>();
  public filterValues = {};

  public isFirstTimePagination = true;

  @Output() private ACtableView: EventEmitter<boolean> = new EventEmitter();

  private maxmizeView = false;
  @Output() ACmaxmizeView: EventEmitter<boolean> = new EventEmitter();

  private paginationInfo = {
    sortOrder: 'asc', sortBy: 'dataoccured',
    numberRowPerPage: 25
  };

  @Input() tableviewChange: GenAssetTableShrinkView;
  @Input() selectedAsset: any;

  public liveData: any;
  public minInnerHeight = "";
  public alarmData: GeneratorAlarmStatus[] = [];
  public copyAlarmData: GeneratorAlarmStatus[] = [];
  public activeCompanyInfoSubscription: any;
  constructor(private router: Router, public appService: AppService){

  }

  ngOnInit() {
   // this.activeCompanyInfoSubscription = this.appService.activeCompanyInfo.subscribe(
   //   (company) => {
   //   }
    //);

    this.setSearchFilter();
  }

  ngAfterViewInit(){
   let elem= <HTMLElement>document.querySelector(".first mfdefaultsorter.sorter a");
    if(elem){
      elem.style.color = "#3e3e3e";
    }
    let elemm= <HTMLElement>document.querySelector(".sec mfdefaultsorter.sorter a");
    if(elemm){
      elemm.style.color = "#3e3e3e";
    }
    let elemmm= <HTMLElement>document.querySelector(".third mfdefaultsorter.sorter a");
    if(elemmm){
      elemmm.style.color = "#3e3e3e";
    }
  }

  setHeightOfDiv() {
    //const headerHeight = document.getElementById('appHeader').offsetHeight;
    const headerHeight = document.getElementById('appHeader').offsetHeight;
    const footerHeigth = document.getElementById('appFooter').offsetHeight;
    //this.minInnerHeight = window.innerHeight - headerHeight - footerHeigth;
    this.minInnerHeight = "initial";
  }

  ngOnDestroy() {
    //this.activeCompanyInfoSubscription.unsubscribe();
  }

  resetFilterData() {
    this.toggleFilterSearch = false;
    this.filterValues = {
      'name': '',
      'occurrence_date_time': '',
      'status': ''
    };
  }

  setSearchFilter() {
    const subscription = this.keyUp
      .map((event) => {
        return {
          'value': event['target'].value,
          'prm': event['target'].id
        }
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        this.filterValues[value.prm] = value.value.toLowerCase();
        this.alarmData = _.filter(this.copyAlarmData, (data) => {
          return ( (this.filterValues['name'] === '' || (data.event_param[0].name && data.event_param[0].name.toLowerCase().includes(this.filterValues['name']))) &&
          (this.filterValues['occurrence_date_time'] === '' || (data.occurrence_date_time && data.occurrence_date_time.includes(this.filterValues['occurrence_date_time']))) &&
          (this.filterValues['status'] === '' || (data.event_param[0].sts && data.event_param[0].sts.toLowerCase().includes(this.filterValues['status']))));

        });
        this.appService.setAllOptionPagination('AdAlarmConsoleTable');
      });

  }

  changeTableView() {
    this.selectedView = this.selectedView ? false : true;
    if (!this.selectedView && !this.tableviewChange.selRTtableView) {
      this.selectedView = true;
    }
    this.ACtableView.emit(this.selectedView);
  }
  changeTableMaxView() {
    this.maxmizeView = this.maxmizeView ? false : true;
    this.ACmaxmizeView.emit(this.maxmizeView);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedAsset && changes.selectedAsset.currentValue) {
      this.alarmData = [];
      this.liveData = [];
      this.copyAlarmData = [];
      this.resetFilterData();


    }
    if (changes.assetAlarmInfo && changes.assetAlarmInfo.currentValue) {
      if (changes.assetAlarmInfo.previousValue) {
        this.setAssetAlarmInfo(changes);


      }
    }

    if (changes.getGenAssetAlaramInfo && changes.getGenAssetAlaramInfo.currentValue) {
      if (changes.getGenAssetAlaramInfo.previousValue) {
        this.getGenAssetAlaramInfoo = this.getGenAssetAlaramInfo;
        this.getAssetAlaramInfo();

      }
    }



    this.paginationInfo.numberRowPerPage = this.numberRowPerPage;
    this.setHeightOfDiv();
  }

 setAssetAlarmInfo(changes) {
    let previousValue = changes.assetAlarmInfo.previousValue;
    let currentValue = changes.assetAlarmInfo.currentValue;
    currentValue.event_param = JSON.parse(currentValue.event_param);
   if (this.copyAlarmData.length === 0) {
     this.liveData.unshift(currentValue);
     return;
   }
    if (moment(this.liveData[0].event_param[0]['ts']) < moment(currentValue.occurrence_date_time)) {
      currentValue.occurrence_date_time = moment.utc(currentValue.occurrence_date_time);
      currentValue.occurrence_date_time = currentValue.occurrence_date_time.local();
      currentValue.occurrence_date_time = currentValue.occurrence_date_time.format('MM/DD/YYYY, hh:mm A');
      if (this.liveData.length > 24) {
        this.liveData.pop();
      }
      this.liveData.unshift(currentValue);
    }
    this.alarmData = this.liveData;
   this.copyAlarmData = this.liveData;
  }

  getAssetAlaramInfo() {


      this.alarmData = [];
      this.copyAlarmData = [];

      if (this.getGenAssetAlaramInfoo) {
        this.alarmData = [];
        this.copyAlarmData = [];
        this.getGenAssetAlaramInfoo.forEach(data => {
          data.assetID = data.assetId;
          data.occurrence_date_time = data.occurrenceDate;
          data.occurrence_date_time = moment.utc(data.occurrenceDate);
          data.occurrence_date_time = data.occurrence_date_time.local();
          data.occurrence_date_time = data.occurrence_date_time.format('MM/DD/YYYY, hh:mm A');
          data.event_param = data.param;
          data.event_param[0].des = data.param[0].description;
          data.event_param[0].sts = data.param[0].status;
          this.alarmData.push(data);
        });
        this.liveData = this.alarmData;
        this.copyAlarmData = this.alarmData;

      }
     // this.isFirstTimePagination ? this.isFirstTimePagination = !!this.appService.setAllOptionPagination() : null;

  }

  goToOperationAlarm(id) {
    this.router.navigate(['/operation/alarm/' + id]);
  }

}
