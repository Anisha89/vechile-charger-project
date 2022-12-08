import * as jQuery from 'jquery';

import {Component, OnInit, AfterViewInit, Input, Output, EventEmitter, SimpleChanges, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import { GenAssetTable, GenAssetTableShrinkView, GenRealtimeStatus } from '../../app-common';
import { AppService } from '../../app.service';
import { Socket } from 'ng-socket-io';
import * as _ from 'underscore';
import * as moment from 'moment';
import * as jsPDF from 'jspdf';
import * as CountUp from 'countup.js';

// declare var CountUp:any;

@Component({
  selector: 'app-generator-realdata',
  templateUrl: './generator-realdata.component.html',
  styleUrls: ['./generator-realdata.component.scss']
})
export class GeneratorRealdataComponent implements OnInit {

  @Input() assetTableInfo: GenAssetTable[] = [];
  private paginationInfo = {
    sortOrder: 'asc', sortBy: 'Name',
    numberRowPerPage: 100
  };
  @Input() getGenUnitForRealTimeData:any[]=[];
  @Input() genAssetTableInfo: any[]=[];
  public genresponse: any[];
  public genunitresponse:any[];
  @Output() private selectedRTData: EventEmitter<string[]> = new EventEmitter();
  private selectedData: string[] = [];
  @Output() private RTtableView: EventEmitter<boolean> = new EventEmitter();
  private selectedView = true;  // shrink
  @Input() tableviewChange: GenAssetTableShrinkView;
  private maxmizeView = false; // max
  @Output() RTmaxmizeView: EventEmitter<boolean> = new EventEmitter();
  public widthArr = [300, 50, 50, 50, 90, 50];
  @Output() remoteCommand: EventEmitter<any> = new EventEmitter();

  public realtimeData = [];
  public tempLiveData = [];
  public unitData = [];
  public exportDiv: any;
  public minInnerHeight = 0;
  public tableHeight;
  public tableThirdHeight;
  public tableHeightt=0;
  public isFirstTimePagination = true;
  public headers = ['DATAPOINT NAME', 'VALUE', 'UNIT', 'NODE', 'LAST UPDATE', 'STATUS'];
  @Input() selectedAsset: any;
  public GenStateOb:any= [];
  public GenState: any;
  public statusBg:any;
  public startMode:any;
  public AlarmStatus: boolean = true;
  public localStartMode:any;
  public startModeBg: any;
  public engineTotalRunTime:any;
  public phaseVoltageAN: any;
  public phaseVoltageBN: any;
  public phaseVoltageCN: any;
  public genCurrentA:any;
  public genCurrentB:any;
  public genCurrentC:any;
  public genTruePower:any;
  public genAparentPower:any;
  public genTotalEnergy:any;
  public genEngineSpeed:any;
  public genFreq:any;
  public genPowerFactor:any;
  public genEngineFuelLevel:any;
  public genEngineTemparatureLevel : any;
  public genCmd:boolean;
  public genBatteryVoltage:any;
  public genEngineOilTemparature:any;
  public engineTotalRunTimeHourOne:number;
  public engineTotalRunTimeHourTwo:number;
  public engineTotalRunTimeHourThree:number;
  public engineTotalRunTimeMinOne:number;
  public engineTotalRunTimeMinTwo:number;
  public engineTotalRunTimeHourFour:number;
  public engineTotalRunTimeHourFive:number;
  public engineTotalRunTimeHourSix:number;
  public engineTotalRunTimeStart:number = 0;
  public hourThr:boolean;
  withoutData:boolean;
  @ViewChild('hourOne') hour1;
  @ViewChild('hourTwo') hour2;
  @ViewChild('hourThree') hour3;
  @ViewChild('hourFour') hour4;
  @ViewChild('hourFive') hour5;
  @ViewChild('hourSix') hour6;
  @ViewChild('minOne') min1;
  @ViewChild('minTwo') min2;
  constructor(private appService: AppService  ) {
    // this.paginationInfo.numberRowPerPage = this.operationService.numberOfRecordPerPage;
    this.RTtableView.emit(this.selectedView);
  }

  ngOnInit() {


  }

  setHeightOfDiv() {
    const tableFirstHeight = document.getElementById('power-data').offsetHeight;
    setTimeout(() => {
      this.tableHeight = tableFirstHeight;
      this.tableThirdHeight = (tableFirstHeight - 50) / 3;
    })

    const headerHeight = document.getElementById('appHeader').offsetHeight;
    const footerHeigth = document.getElementById('appFooter').offsetHeight;
    this.minInnerHeight = window.innerHeight - headerHeight - footerHeigth;
  }

  ngAfterViewInit() {
    this.setHeightOfDiv();
  }
  ngOnDestroy(){
  }



  realTimeDataChange($event) {
    let x = $event.target || $event.srcElement;
    if (x.checked) {
      this.selectedData.push(x.value);
    } else {
      this.selectedData = _.without(this.selectedData, x.value);
    }
    this.selectedRTData.emit(this.selectedData);
  }



  ngOnChanges(changes: SimpleChanges) {

    if (changes.getGenUnitForRealTimeData && changes.getGenUnitForRealTimeData.currentValue) {
      this.genunitresponse = this.getGenUnitForRealTimeData;
      if(this.genunitresponse && this.genunitresponse.length > 0) {
       this.unitData = this.genunitresponse[0].param;
        if (this.genresponse) {
          this.getAssetTableInfo();
        }
      }
      if (this.genresponse) {
        this.getAssetTableInfo();
      }

    }

    if (changes.genAssetTableInfo && changes.genAssetTableInfo.currentValue) {
      this.genresponse=this.genAssetTableInfo;
      if(this.unitData && this.unitData.length > 0){
       this.getAssetTableInfo();
      }

    }


    if (changes.assetTableInfo && changes.assetTableInfo.currentValue) {
      let data = changes.assetTableInfo.currentValue;
      data.event_param = JSON.parse(data.event_param);
      this.tempLiveData = [];
      const that = this;
      data.event_param.forEach(evt => {
        that.tempLiveData.push({
          'name': evt.name,
          'value': evt._val,
          'unit': evt.unit,
          'node': evt.node,
          'ts': evt.TS,
          'status': evt.sts
        });
      });
      if (this.unitData) {
        this.setUnitForRealTimeData(this.tempLiveData, this.unitData);
      }
      this.isFirstTimePagination = true;
     // this.genGetRealData();
    }


    if (changes.selectedAsset && changes.selectedAsset.currentValue) {
      this.getAssetTableInfo();
    }


    //console.log(this.realtimeData);

  }





  getUnitForRealTimeData(realtimeData) {
      this.setUnitForRealTimeData(realtimeData[0].param, this.unitData);

  }

  setUnitForRealTimeData(realtimeData, unitData) {
    this.realtimeData = [];
    realtimeData.forEach(data => {
      for (let index = 0; index < unitData.length; index++) {
        var element = unitData[index];
        element.node = element.node ? element.node : '';
        if (data.name === element.pointName && data.node === element.node) {
          data.ts = moment(data.ts).local().format('MM/DD/YYYY, hh:mm A');
          data.unit = element.pointUnit;
          this.realtimeData.push(new GenRealtimeStatus(data.name, data.value, data.unit, Number(data.node), data.ts, data.status))
          this.realtimeData[this.realtimeData.length - 1].isNumber = (data.value == 0) ? true : Number(data.value) ? true : false;
          break;
        }
      }
    });

    //this.isFirstTimePagination ? this.isFirstTimePagination = !!this.appService.setAllOptionPagination('realTimeDataTable') : null;
  }

  getAssetTableInfo() {
      this.realtimeData = [];
      this.tempLiveData = [];
      if (this.genresponse[0]) {
        this.getUnitForRealTimeData(this.genresponse);

        this.genGetRealData();

      } else {
        document.getElementsByTagName('body')[0].style.pointerEvents = '';
      }

  }

  genGetRealData(){
    this.GenStateOb = this.realtimeData.filter(function( obj ) {
      return obj.name == "Genset State";
    })
    if(this.GenStateOb && this.GenStateOb.length > 0){
      this.GenState = this.GenStateOb[0];
      if(this.GenState && this.GenState.value === "Standby"){
        this.statusBg= "Orange"
      } else if (this.GenState && this.GenState.value === "Off"){
        this.statusBg= "Red"
      } else if (this.GenState && this.GenState.value === "Running"){
        this.statusBg= "Green"
      } else if (this.GenState && this.GenState.value === "Shutdown"){
        this.statusBg= "DarkRed"
      } else if (this.GenState && this.GenState.value === "Idle"){
        this.statusBg= "Orange"
      } else{
        this.statusBg= "Yellow"
      }

    } else{
      this.GenState = {};
      this.statusBg= "Yellow";
    }

    let AlarmStatus = this.realtimeData.filter(function( obj ) {
      return obj.name == "Alarm Status";
    })

    if(AlarmStatus && AlarmStatus.length > 0){
      let alrmsts=AlarmStatus[0].value;
      if(alrmsts && alrmsts === 0){
        this.AlarmStatus=false;
      }else{
        this.AlarmStatus=true;
      }

    }

    let localStartMode = this.realtimeData.filter(function( obj ) {
      return obj.name == "Local Start Mode";
    })
    if(localStartMode && localStartMode.length > 0){
      this.localStartMode=localStartMode[0];
      if(this.localStartMode && this.localStartMode.value === "Standby"){
        this.startMode= "Orange"
      } else if (this.localStartMode && this.localStartMode.value === "Off"){
        this.startMode= "Off"
      } else if (this.localStartMode && this.localStartMode.value === "Running"){
        this.startMode= "Green"
      } else if (this.localStartMode && this.localStartMode.value === "Shutdown"){
        this.startMode= "DarkRed"
      } else if (this.localStartMode && this.localStartMode.value === "Idle"){
        this.startMode= "Orange"
      } else{
        this.startMode= "On"
      }
    }else{
      this.localStartMode={};
      this.startMode= "On";
    }
    let engineTotalRunTime = this.realtimeData.filter(function( obj ) {
      return obj.name == "Engine Total Run Time";
    })
    if(engineTotalRunTime && engineTotalRunTime.length > 0){
      let engineTotalRunTimee = engineTotalRunTime[0].value;
      var decimalTime = parseFloat(engineTotalRunTimee);
      decimalTime = decimalTime * 60 * 60;
      let hours = Math.floor((decimalTime / (60 * 60)));
      decimalTime = decimalTime - (hours * 60 * 60);
      let minutes = Math.floor((decimalTime / 60));
      decimalTime = decimalTime - (minutes * 60);
      this.engineTotalRunTime =`${hours} hours  ${minutes} minutes`;
      let hourDigits = hours.toString().split('');
      if(hourDigits[0]){
         this.engineTotalRunTimeHourOne =parseInt(hourDigits[0]);
         this.countUp(this.engineTotalRunTimeHourOne,1);
      }else{
        this.engineTotalRunTimeHourOne=0;
      }
      if(hourDigits[1]){
      this.engineTotalRunTimeHourTwo =parseInt(hourDigits[1]);
        this.countUp(this.engineTotalRunTimeHourTwo,2);
      }else{
        this.engineTotalRunTimeHourTwo=0;
      }
      if(hourDigits[2]) {
        this.engineTotalRunTimeHourThree = parseInt(hourDigits[2]);
        this.countUp(this.engineTotalRunTimeHourThree,3);
      }else{
        this.hourThr=true;
        this.engineTotalRunTimeHourThree=0;
      }
      if(hourDigits[3]) {
        this.engineTotalRunTimeHourFour = parseInt(hourDigits[3]);
        this.countUp(this.engineTotalRunTimeHourFour,4);
      }else{
        this.hourThr=true;
        this.engineTotalRunTimeHourFour=0;
      }
      if(hourDigits[4]) {
        this.engineTotalRunTimeHourFive = parseInt(hourDigits[4]);
        this.countUp(this.engineTotalRunTimeHourFive,5);
      }else{
        this.hourThr=true;
        this.engineTotalRunTimeHourFive=0;
      }
      if(hourDigits[5]) {
        this.engineTotalRunTimeHourSix = parseInt(hourDigits[5]);
        this.countUp(this.engineTotalRunTimeHourSix,6);
      }else{
        this.hourThr=true;
        this.engineTotalRunTimeHourSix=0;
      }

      let minDigits = minutes.toString().split('');
      if(minDigits[0]){
        this.engineTotalRunTimeMinOne =parseInt(minDigits[0]);
        this.countUp(this.engineTotalRunTimeMinOne,7);
      }
      if(minDigits[1]){
        this.engineTotalRunTimeMinTwo =parseInt(minDigits[1]);
        this.countUp(this.engineTotalRunTimeMinTwo,8);
      }
      this.withoutData=false;

    } else{
      this.engineTotalRunTimeHourOne=0;
      this.engineTotalRunTimeHourTwo=0;
      this.engineTotalRunTimeHourThree=0;
      this.engineTotalRunTimeHourFour=0;
      this.engineTotalRunTimeHourFive=0;
      this.engineTotalRunTimeHourSix=0;
      this.engineTotalRunTimeMinOne=0;
      this.engineTotalRunTimeMinTwo=0;

      this.countUp(this.engineTotalRunTimeHourOne,1);
      this.countUp(this.engineTotalRunTimeHourTwo,2);
      this.countUp(this.engineTotalRunTimeHourThree,3);
      this.countUp(this.engineTotalRunTimeHourFour,4);
      this.countUp(this.engineTotalRunTimeHourFive,5);
      this.countUp(this.engineTotalRunTimeHourSix,6);
      this.countUp(this.engineTotalRunTimeMinOne,7);
      this.countUp(this.engineTotalRunTimeMinTwo,8);
      this.withoutData=true;
    }

    let phaseVoltageAN = this.realtimeData.filter(function( obj ) {
      return obj.name == "Generator Phase Voltage AN";
    })

    if(phaseVoltageAN && phaseVoltageAN.length > 0){
      this.phaseVoltageAN =phaseVoltageAN[0];
    }else{
      this.phaseVoltageAN = {};
    }
    let phaseVoltageBN = this.realtimeData.filter(function( obj ) {
      return obj.name == "Generator Phase Voltage BN";
    })

    if(phaseVoltageBN && phaseVoltageBN.length > 0){
      this.phaseVoltageBN =phaseVoltageBN[0];
    }else{
      this.phaseVoltageBN ={};
    }
    let phaseVoltageCN = this.realtimeData.filter(function( obj ) {
      return obj.name == "Generator Phase Voltage CN";
    })

    if(phaseVoltageCN && phaseVoltageCN.length > 0){
      this.phaseVoltageCN =phaseVoltageCN[0];
    }else{
      this.phaseVoltageCN ={};
    }
    let genCurrentA = this.realtimeData.filter(function( obj ) {
      return obj.name == "Generator Current A";
    })

    if(genCurrentA && genCurrentA.length > 0){
      this.genCurrentA =genCurrentA[0];
    }else{
      this.genCurrentA ={};
    }
    let genCurrentB = this.realtimeData.filter(function( obj ) {
      return obj.name == "Generator Current B";
    })

    if(genCurrentB && genCurrentB.length > 0){
      this.genCurrentB =genCurrentB[0];
    }else{
      this.genCurrentB ={};
    }
    let genCurrentC = this.realtimeData.filter(function( obj ) {
      return obj.name == "Generator Current C";
    })

    if(genCurrentC && genCurrentC.length > 0){
      this.genCurrentC =genCurrentC[0];
    }else{
      this.genCurrentC ={};
    }

    let genTruePower = this.realtimeData.filter(function( obj ) {
      return obj.name == "Generator True Total Power";
    })

    if(genTruePower && genTruePower.length > 0){
      this.genTruePower =genTruePower[0];
    }else{
      this.genTruePower ={};
    }

    let genAparentPower = this.realtimeData.filter(function( obj ) {
      return obj.name == "Generator Total Apparent Power";
    })

    if(genAparentPower && genAparentPower.length > 0){
      this.genAparentPower =genAparentPower[0];
    }else{
      this.genAparentPower ={};
    }
    let genTotalEnergy = this.realtimeData.filter(function( obj ) {
      return obj.name == "Genset Total Energy";
    })

    if(genTotalEnergy && genTotalEnergy.length > 0){
      this.genTotalEnergy =genTotalEnergy[0];
    }else{
      this.genTotalEnergy ={};
    }

    let genEngineSpeed = this.realtimeData.filter(function( obj ) {
      return obj.name == "Engine Speed";
    })

    if(genEngineSpeed && genEngineSpeed.length > 0){
      this.genEngineSpeed =genEngineSpeed[0];
    }else{
      this.genEngineSpeed ={};
    }
    let genFreq = this.realtimeData.filter(function( obj ) {
      return obj.name == "Generator Frequency";
    })

    if(genFreq && genFreq.length > 0){
      this.genFreq =genFreq[0];
    }else{
      this.genFreq ={};
    }
    let genPowerFactor = this.realtimeData.filter(function( obj ) {
      return obj.name == "Power Factor";
    })

    if(genPowerFactor && genPowerFactor.length > 0){
      this.genPowerFactor =genPowerFactor[0];
    }else{
      this.genPowerFactor ={};
    }

    let genEngineFuelLevel = this.realtimeData.filter(function( obj ) {
      return obj.name == "Engine Fule Level";
    })

    if(genEngineFuelLevel && genEngineFuelLevel.length > 0){
      this.genEngineFuelLevel = genEngineFuelLevel[0];
      this.genEngineFuelLevel.nm="Fuel";
      this.genEngineFuelLevel.color="#e56a00";
      this.genEngineFuelLevel.min="0";
      this.genEngineFuelLevel.max="100";
      this.genEngineFuelLevel.minValue=0;
      this.genEngineFuelLevel.maxValue=100;
    }else{
      this.genEngineFuelLevel ={};
      this.genEngineFuelLevel.nm="Fuel";
      this.genEngineFuelLevel.color="#e56a00";
      this.genEngineFuelLevel.min="0";
      this.genEngineFuelLevel.max="100";
      this.genEngineFuelLevel.minValue=0;
      this.genEngineFuelLevel.maxValue=100;
      this.genEngineFuelLevel.value=-1;
      this.genEngineFuelLevel.unit="-";
    }

    let genEngineTemparatureLevel = this.realtimeData.filter(function( obj ) {
      return obj.name == "Engine Coolant Temperature";
    })

    if(genEngineTemparatureLevel && genEngineTemparatureLevel.length > 0){
      this.genEngineTemparatureLevel = genEngineTemparatureLevel[0];
      this.genEngineTemparatureLevel.nm="coolant";
      this.genEngineTemparatureLevel.color="#add";
      this.genEngineTemparatureLevel.min="C";
      this.genEngineTemparatureLevel.max="H";
      this.genEngineTemparatureLevel.minValue=50;
      this.genEngineTemparatureLevel.maxValue=125;
    }else{
      this.genEngineTemparatureLevel = {};
      this.genEngineTemparatureLevel.nm="coolant";
      this.genEngineTemparatureLevel.color="#add";
      this.genEngineTemparatureLevel.min="C";
      this.genEngineTemparatureLevel.max="H";
      this.genEngineTemparatureLevel.minValue=50;
      this.genEngineTemparatureLevel.maxValue=125;
      this.genEngineTemparatureLevel.value=-1;
      this.genEngineTemparatureLevel.unit="-";
    }


    let genBatteryVoltage = this.realtimeData.filter(function( obj ) {
      return obj.name == "Battery Voltage";
    })

    if(genBatteryVoltage && genBatteryVoltage.length > 0){
      this.genBatteryVoltage = genBatteryVoltage[0];
      this.genBatteryVoltage.nm="battery";
      this.genBatteryVoltage.color="#add";
      this.genBatteryVoltage.min="E";
      this.genBatteryVoltage.max="F";
      this.genBatteryVoltage.minValue=0;
      this.genBatteryVoltage.maxValue=60;
      this.genBatteryVoltage.unit="%";
      this.genBatteryVoltage.value=this.toInteger(this.genBatteryVoltage.value);
    }else{
      this.genBatteryVoltage = {};
      this.genBatteryVoltage.nm="battery";
      this.genBatteryVoltage.color="#add";
      this.genBatteryVoltage.min="E";
      this.genBatteryVoltage.max="F";
      this.genBatteryVoltage.minValue=0;
      this.genBatteryVoltage.maxValue=60;
      this.genBatteryVoltage.unit="-";
      this.genBatteryVoltage.value=-1;
    }

    let genEngineOilTemparature = this.realtimeData.filter(function( obj ) {
      return obj.name == "Engine Oil Temperature";
    })

    if(genEngineOilTemparature && genEngineOilTemparature.length > 0){
      this.genEngineOilTemparature = genEngineOilTemparature[0];
      this.genEngineOilTemparature.nm="Oil Temp";
      this.genEngineOilTemparature.color="#add";
      this.genEngineOilTemparature.min="0";
      this.genEngineOilTemparature.max="570";
      this.genEngineOilTemparature.minValue=0;
      this.genEngineOilTemparature.maxValue=570;
      this.genEngineOilTemparature.value=this.toInteger(this.genEngineOilTemparature.value);
    } else{
      this.genEngineOilTemparature={};
      this.genEngineOilTemparature.nm="Oil Temp";
      this.genEngineOilTemparature.color="#add";
      this.genEngineOilTemparature.min="0";
      this.genEngineOilTemparature.max="570";
      this.genEngineOilTemparature.minValue=0;
      this.genEngineOilTemparature.maxValue=570;
      this.genEngineOilTemparature.value=-1;
      this.genEngineOilTemparature.unit="-";

    }

    let genRemoteCommand = this.realtimeData.filter(function( obj ) {
      return obj.name == "Remote Command";
    })

    if(genRemoteCommand && genRemoteCommand.length > 0){
      let genRemoteCommandd = genRemoteCommand[0].value;
      let genRemoteCommanddd=this.toInteger(genRemoteCommandd);
      if (genRemoteCommanddd === 0){
        this.genCmd= true;
      }
      else{
        this.genCmd= false;
      }
    }else{
        this.genCmd= true;
    }








  }

  toInteger(number){
    return Math.round(  // round to nearest integer
      Number(number)    // type cast your input
    );
  };
  rmtCommand(cmd){
    if(cmd ){
      if(confirm("Are you sure to stop")) {
        this.remoteCommand.emit("1");
        this.genCmd= !this.genCmd;
      }

    }else{
      if(confirm("Are you sure to start")) {
        this.remoteCommand.emit("0");
        this.genCmd= !this.genCmd;

      }

    }


  }

  countUp(maxCount, hourNum){
    let countHour;
    if(hourNum == 1){
      countHour=this.hour1.nativeElement;
    } else if (hourNum == 2){
      countHour=this.hour2.nativeElement;
    } else if(hourNum == 3){
      countHour=this.hour3.nativeElement;
    } else if (hourNum == 4){
      countHour=this.hour4.nativeElement;
    } else if(hourNum == 5){
      countHour=this.hour5.nativeElement;
    } else if (hourNum == 6){
      countHour=this.hour6.nativeElement;
    } else if(hourNum == 7){
      countHour=this.min1.nativeElement;
    } else if(hourNum == 8){
      countHour=this.min2.nativeElement;
    }

    let numAnim = new CountUp(countHour, 0, maxCount);
    if (!numAnim.error) {
      numAnim.start();
    } else {
      console.error(numAnim.error);
    }
  }


}
