import { Component, OnInit, Input } from '@angular/core';
import { HeatMapChart, MultiChartData } from '../ichart';
@Component({
  selector: 'app-heat-map-chart',
  templateUrl: './heat-map-chart.component.html',
  styleUrls: ['./heat-map-chart.component.scss']
})
export class HeatMapChartComponent implements OnInit {

  @Input() data: MultiChartData[] = this.data ? this.data : null;
  @Input() chartInfo: any;

  heatMapChartInfo: HeatMapChart;


  constructor() { }

  ngOnInit() {
    this.chartInfo = this.chartInfo === undefined ? {} : this.chartInfo;
    this.heatMapChartInfo = new HeatMapChart(this.chartInfo);
  }

  onSelect(event) {
  }

}
