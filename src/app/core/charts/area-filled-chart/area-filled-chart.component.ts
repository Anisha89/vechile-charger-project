import { Component, NgModule, OnInit, Input, SimpleChange } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { single, multi } from './area-filled-chart.data';
import { SingleChartData, MultiChartData, AreaFilledChart, AreaFilledChartData } from '../ichart';
import * as d3 from 'd3';
import { curveLinear, curveNatural } from 'd3-shape';
import { DatePipe } from '@angular/common';
import * as _ from 'underscore';

@Component({
  selector: 'app-area-filled-chart',
  templateUrl: './area-filled-chart.component.html',
  styleUrls: ['./area-filled-chart.component.scss']
})
export class AreaFilledChartComponent implements OnInit {

  @Input() data: AreaFilledChartData[] = this.data ? this.data : multi;
  @Input() chartInfo: any;
  areaFilledChartInfo: AreaFilledChart;
  single: any[];
  multi: any[];

  view: any[] = [700, 400];

  constructor() {
    Object.assign(this, { single, multi })
  }

  ngOnInit() {
    console.log(this.multi);
    console.log(this.data);
    this.chartInfo = this.chartInfo === undefined ? {} : this.chartInfo;
    this.areaFilledChartInfo = new AreaFilledChart(this.chartInfo);
  }

  ngOnChanges(changes: SimpleChange) {
    console.log(changes);
    this.updateLineChartData(changes);
  }

  updateLineChartData(changes) {
    if (changes.chartInfo && this.areaFilledChartInfo) {
      _.each(this.areaFilledChartInfo, (val, key) => {
        if (changes.chartInfo.currentValue[key]) {
          if (changes.chartInfo.currentValue[key].toLowerCase() === 'true' || changes.chartInfo.currentValue[key].toLowerCase() === 'false') {
            changes.chartInfo.currentValue[key] = changes.chartInfo.currentValue[key].toLowerCase() === 'true' ? true : false;
          }
          this.areaFilledChartInfo[key] = changes.chartInfo.currentValue[key];
        }
      });
    }
  }

  onSelect(event) {

  }

}
