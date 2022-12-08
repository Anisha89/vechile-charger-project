
import * as jQuery from 'jquery';
import {Component, NgModule, OnInit, SimpleChanges, Input, ViewChild, ElementRef} from '@angular/core'
//import {singleGaugeData} from "../ichart";

import * as _ from 'underscore';
import {jqxGaugeComponent} from "../jqxgauge/jqxgauge.component";

@Component({
  selector: 'app-half-gauge',
  templateUrl: './half-gauge.component.html',
  styleUrls: ['./half-gauge.component.scss']
})
export class HalfGaugeComponent {
  public gauge;
  @Input() fuelUnit:string ;
  @Input() fuelTitle:string;
  @Input() fuelMeter:number;
  @Input() minValue:number=this.minValue ? this.minValue : 0;
  @Input() maxValue:number=this.maxValue ? this.maxValue : 100;
  @Input() fuelMin:any=this.fuelMin ? this.fuelMin : "0";
  @Input() fuelMax:any=this.fuelMax ? this.fuelMax : "100";
  @Input() color:string=this.color ? this.color: "#e56a00";
  @ViewChild('gaugeRedMask') gaugeeRedMask;
  public fuelMeterr:any;
  public fuelUnitt:string;
  public fuelClass:boolean;
  public gaugeMeter:number;
  wdt:number=170;
  minvalue:number=0;
  maxvalue:number=100;
  ticksMinor: any;
  ticksMajor: any;
  ranges: any[];
  gauge1:boolean=false;
  gauge2:boolean=false;
  gauge3:boolean=false;
  gauge4:boolean=false;


  @ViewChild('myGauge') myGauge: jqxGaugeComponent;
  @ViewChild('gaugeValue') gaugeValue: ElementRef;




  border=  { size: '10%', style: { stroke: '#cccccc'}, visible: false, showGradient: true };

  labels: any = {
    interval: 20,
    formatValue: function (value) { return value; }
  };


  onValueChanging(event: any): void {
    if(this.fuelUnitt){
      this.gaugeValue.nativeElement.innerHTML = Math.round(event.args.value) + ' ' + this.fuelUnitt;
    }else{
      this.gaugeValue.nativeElement.innerHTML = Math.round(event.args.value) + ' --';
    }

  }



  constructor() {
  }

  ngAfterViewInit(): void  {
    // this.dynamicMeter();
  }

  dynamicRange(){
    if(this.maxvalue === 60){
      this.ticksMinor = { interval: 3, size: '5%' };
      this.gauge2=true;
      this.ticksMajor= { interval: 6, size: '9%' };

      this.ranges =
        [
          { startValue: 0, endValue: 20, style: { fill: '#4bb648', stroke: '#4bb648' }, endWidth: 2, startWidth: 1 },
          { startValue: 20, endValue: 40, style: { fill: '#fbd109', stroke: '#fbd109' }, endWidth: 4, startWidth: 2 },
          { startValue: 40, endValue: 50, style: { fill: '#ff8000', stroke: '#ff8000' }, endWidth: 6, startWidth: 4 },
          { startValue: 50, endValue: 60, style: { fill: '#e02629', stroke: '#e02629' }, endWidth: 8, startWidth: 6 }
        ];
    } else if(this.maxvalue === 570){
      this.ticksMinor = { interval: 28, size: '5%' };
      this.gauge3=true;
      this.ticksMajor= { interval: 57, size: '9%' };
      this.labels={ distance: '38%', position: 'none', interval: 100, offset: [0, -10], visible: true, formatValue: function (value) { return value; }};

      this.ranges =
        [
          { startValue: 0, endValue: 140, style: { fill: '#4bb648', stroke: '#4bb648' }, endWidth: 2, startWidth: 1 },
          { startValue: 140, endValue: 280, style: { fill: '#fbd109', stroke: '#fbd109' }, endWidth: 4, startWidth: 2 },
          { startValue: 280, endValue: 420, style: { fill: '#ff8000', stroke: '#ff8000' }, endWidth: 6, startWidth: 4 },
          { startValue: 420, endValue: 570, style: { fill: '#e02629', stroke: '#e02629' }, endWidth: 8, startWidth: 6 }
        ];
    } else if(this.maxvalue === 125){
      this.ticksMinor = { interval: 6, size: '5%' };
      this.gauge4=true;
      this.ticksMajor= { interval: 12, size: '9%' };

      this.ranges =
        [
          { startValue: 50, endValue: 70, style: { fill: '#4bb648', stroke: '#4bb648' }, endWidth: 2, startWidth: 1 },
          { startValue: 70, endValue: 90, style: { fill: '#fbd109', stroke: '#fbd109' }, endWidth: 4, startWidth: 2 },
          { startValue: 90, endValue: 110, style: { fill: '#ff8000', stroke: '#ff8000' }, endWidth: 6, startWidth: 4 },
          { startValue: 110, endValue: 125, style: { fill: '#e02629', stroke: '#e02629' }, endWidth: 8, startWidth: 6 }
        ];
    } else {
      this.ticksMinor = { interval: 5, size: '5%' };
      this.gauge1=true;
      this.ticksMajor= { interval: 10, size: '9%' };

      this.ranges =
        [
          { startValue: 0, endValue: 33, style: { fill: '#4bb648', stroke: '#4bb648' }, endWidth: 2, startWidth: 1 },
          { startValue: 33, endValue: 50, style: { fill: '#fbd109', stroke: '#fbd109' }, endWidth: 4, startWidth: 2 },
          { startValue: 50, endValue: 75, style: { fill: '#ff8000', stroke: '#ff8000' }, endWidth: 6, startWidth: 4 },
          { startValue: 75, endValue: 100, style: { fill: '#e02629', stroke: '#e02629' }, endWidth: 8, startWidth: 6 }
        ];
    }

  }


  dynamicMeter(){

    if(this.maxValue){
      this.maxvalue=this.toInteger(this.maxValue);
    }

    if(this.minValue){
      this.minvalue=this.toInteger(this.minValue);
    }
    this.dynamicRange();
    setTimeout(() => {
      this.myGauge.value(this.gaugeMeter);
    })


  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.fuelTitle && changes.fuelTitle.currentValue) {
      this.fuelTitle = this.fuelTitle;
      if (this.fuelTitle === 'Fuel') {
        this.fuelClass = true;
      }
    }

    if (changes.fuelMeter && changes.fuelMeter.currentValue) {


      if(this.fuelUnit === "&degF"){
        this.fuelUnitt="°F";
      }
      else if(this.fuelUnit === "&degC"){
        this.fuelUnitt="°C";
      }
      else{
        this.fuelUnitt=this.fuelUnit;
      }
      if(this.fuelMeter === -1 ){
        this.gaugeMeter=0;
        this.fuelMeterr="-";
      } else{
        this.fuelMeterr=this.toInteger(this.fuelMeter);
        let flMeter= this.toInteger(this.fuelMeter - this.minValue);
        let diffMeter=this.toInteger(this.maxValue - this.minValue);
        let actualMeter= 100 * flMeter / diffMeter;
        this.gaugeMeter=this.toInteger(this.fuelMeter);
      }

      this.dynamicMeter();

    }

  }

  toInteger(number){
    return Math.round(  // round to nearest integer
      Number(number)    // type cast your input
    );
  };



}
