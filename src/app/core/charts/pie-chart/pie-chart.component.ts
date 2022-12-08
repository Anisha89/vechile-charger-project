import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import {SingleChartData, PieChatConfig} from '../ichart';
import * as _ from 'underscore';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  private pieChartInfo: PieChatConfig;
  private activeEntries: any[] = [];
  private currentActiveEntry: SingleChartData;
  @Output() public selectedData: EventEmitter<SingleChartData> = new EventEmitter<SingleChartData>();
  @Input() public set clearActiveData(v: boolean) {
    if (!v) {
      this.activeEntries = [];
    }
  }

  @Input() public set chartInfo (pieChartConfig: PieChatConfig){
    this.pieChartInfo = pieChartConfig;
    //console.log(this.pieChartInfo);
    //chart = chart === undefined ? {} : chart;
    //this.pieChartInfo = new PieChart(chart);

  };

  @Input() public data: SingleChartData[] = this.data ? this.data : [];
  constructor() { }

  ngOnInit() {
    // console.log(this.pieChartInfo);
  }

  ngOnChanges(changes: SimpleChange) {
    // console.log(changes);
  }

  onSelect(event) {
    //console.log(event);

    if (typeof event === 'string') {
       const i = _.findIndex(this.data, function(i) { return i.name === event});
      this.currentActiveEntry = {name : event, value : this.data[i].value};
    } else {
      this.currentActiveEntry = event;
    }
    console.log(this.currentActiveEntry);
     this.selectedData.emit(this.currentActiveEntry);
   // this.activeEntries.push(event);
  }
  onActivate(item) {
  }

  pieDeactivate($event) {
    if (this.currentActiveEntry) {
      this.activeEntries = [];
      this.activeEntries.push(this.currentActiveEntry);
    }
  }

  tooltipTextFormap(tooltipText) {
    return `${tooltipText.data.name}<br/><span class="custom-label-text">${tooltipText.data.value}%</span>`;
  }

}
