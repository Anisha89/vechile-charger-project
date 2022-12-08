import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  LineChartConfig
} from '../ichart';
import * as d3 from 'd3';
import { curveLinear, curveNatural } from 'd3-shape';
import { DatePipe } from '@angular/common';
import * as _ from 'underscore';
import * as moment from 'moment';
import {AppService} from "../../../app.service";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  providers: [DatePipe]
})
export class LineChartComponent implements OnInit, OnChanges {

  @Input() result: any[] = [];
  @Input() resultt: any[] = [];
  public getAnalyticInfo: any[] = [];
  public results: any[] = [];


  axisTickFormatting: any;

  public curve: any = curveNatural;


  lineChartInfo: LineChartConfig;
  @Input() chartInfo: LineChartConfig;


  view: any[];

  constructor(private datePipe: DatePipe, private appService: AppService) {
  }

  ngOnInit() {

    //this.chartInfo = this.chartInfo === undefined ? {} : this.chartInfo;
    //console.log(this.chartInfo);
    //this.lineChartInfo = new LineChart(this.chartInfo);
    this.lineChartInfo = this.chartInfo;
    if (this.lineChartInfo && this.lineChartInfo.axisTickFormatting === false) {
      this.axisTickFormatting = null;
    } else{
      this.axisTickFormatting = ((data) => {
        return this.datePipe.transform(data, 'M/d');
      });
    }

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.result && changes.result.currentValue) {
        this.getAnalyticInfo = this.result;
    }
    this.result.forEach((item, key) => {
      this.result[key].name = this.appService.typeCastingForChart(this.result[key].name, this.lineChartInfo.seriesNameDataType);
      item.series.forEach((seriesItem, k) => {
        this.result[key].series[k].name = this.appService.typeCastingForChart(this.result[key].series[k].name, this.lineChartInfo.xAxisDataType);
        this.result[key].series[k].value = this.appService.typeCastingForChart(this.result[key].series[k].value, this.lineChartInfo.yAxisDataType);
      });
    });
    this.getAnalyticInfo = this.result;
    //console.log(this.result);
    //console.log('getAnalyticInfo', this.getAnalyticInfo);
    this.updateLineChartData(changes);
  }

  updateLineChartData(changes) {
    if (changes.chartInfo && this.lineChartInfo) {
      //console.log(this.lineChartInfo);
      //console.log(changes.chartInfo.currentValue);
      _.each(this.lineChartInfo, (val, key) => {
        if (changes.chartInfo.currentValue[key]) {
          if(changes.chartInfo.currentValue[key].toLowerCase() === 'true' || changes.chartInfo.currentValue[key].toLowerCase() === 'false') {
            changes.chartInfo.currentValue[key] = changes.chartInfo.currentValue[key].toLowerCase() === 'true' ? true : false;
          }
          this.lineChartInfo[key] = changes.chartInfo.currentValue[key];
        }
      });
    }
  }

  onSelect($event) {

  }

}
