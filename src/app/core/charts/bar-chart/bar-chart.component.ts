import {Component, OnInit, Input, SimpleChange, SimpleChanges, Injector} from '@angular/core';
import {SingleChartData, MultiChartData, BarChart, SingleChartDataa} from '../ichart';
import { DatePipe } from '@angular/common';
import {AppService} from "../../../app.service";
declare var moment: any;
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  providers: [DatePipe]
})
export class BarChartComponent implements OnInit {


  @Input() data: any[] = [];
  public getAnalyticInfoo: any[] = [];
  public results: any[] = [];
  @Input() chartInfo: any;

  axisTickFormatting: any;

  barChartInfo: BarChart;

  private appService: AppService;
  constructor(private datePipe: DatePipe, injector:Injector) {
    this.appService = injector.get(AppService);
    // console.log(this.appService.userTimezone);
  }

  ngOnInit() {
    // console.log(this.chartInfo);
    this.chartInfo = this.chartInfo === undefined ? {} : this.chartInfo;
    this.barChartInfo = new BarChart(this.chartInfo);
    console.log(this.barChartInfo);
    if (this.barChartInfo && this.barChartInfo.axisTickFormatting === false) {
      this.axisTickFormatting = null;
    }else{
      this.axisTickFormatting = ((data) => {
        return this.datePipe.transform(data, 'M/d');
      });
    }

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.data && changes.data.currentValue) {
      console.log(changes.data.currentValue);
      this.getAnalyticInfoo = changes.data.currentValue;
      this.getAnalyticInfo();
    }

    if (changes['chartInfo'] && changes['chartInfo'].currentValue) {
      let data = changes['chartInfo'].currentValue;
      if(changes['chartInfo'].currentValue.data) {
        data = changes['chartInfo'].currentValue.data;
        data.colorScheme = changes['chartInfo'].currentValue.colorScheme;
      }
      this.barChartInfo = new BarChart(data);
    }
  }

  getAnalyticInfo(){
    this.results = [];
    console.log(this.getAnalyticInfoo);
    if (this.getAnalyticInfoo) {
      this.getAnalyticInfoo.forEach(data => {
        this.results.push(new SingleChartDataa(this.appService.typeCastingForChart(data.value, this.barChartInfo.yAxisValueDataType), this.appService.typeCastingForChart(data.occurrenceStartDate, this.barChartInfo.xAxisValueDataType)));
      });
    }
    console.log(this.results);
  }


  onSelect(event) {

  }
}
