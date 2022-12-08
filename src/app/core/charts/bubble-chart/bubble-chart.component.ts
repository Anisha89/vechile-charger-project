import { Component, OnInit, Input, Directive } from '@angular/core';
import { BubbleChartData, MultiChartData, BubbleChart } from '../ichart';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';
import * as _ from 'underscore';
declare var d3: any;
@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})

export class BubbleChartComponent {

  @Input() data: BubbleChartData[] = this.data ? this.data : null;
  @Input() chartInfo: any;

  bubbleChartInfo: BubbleChart;

  constructor() { }

  ngOnInit() {
    this.chartInfo = this.chartInfo === undefined ? {} : this.chartInfo;
    this.bubbleChartInfo = new BubbleChart(this.chartInfo);
  }

  ngOnChanges(changes: SimpleChange) {
    console.log(changes);
    this.updateLineChartData(changes);
  }

  updateLineChartData(changes) {
    if (changes.chartInfo && this.bubbleChartInfo) {
      _.each(this.bubbleChartInfo, (val, key) => {
        if (changes.chartInfo.currentValue[key]) {
          if(changes.chartInfo.currentValue[key].toLowerCase() === 'true' || changes.chartInfo.currentValue[key].toLowerCase() === 'false') {
            changes.chartInfo.currentValue[key] = changes.chartInfo.currentValue[key].toLowerCase() === 'true' ? true : false;
          }
          this.bubbleChartInfo[key] = changes.chartInfo.currentValue[key];
        }
      });
    }
  }

  onSelect(event) {

  }
}
