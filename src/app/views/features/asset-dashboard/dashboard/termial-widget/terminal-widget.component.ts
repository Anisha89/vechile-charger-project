import { Component, Input, OnInit } from '@angular/core';
import { ChargingTerminal } from '../../../../../models/charging-terminal.model';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-terminal-widget',
    templateUrl: 'terminal-widget.component.html',
    styleUrls: ['terminal-widget.component.scss']
})
export class TerminalWidgetComponent implements OnInit {
    @Input() terminal: ChargingTerminal;

    public sales: number;
    public mainChartElements = 7;
    public mainChartData1: Array<number> = [];
    public mainChartData3: Array<number> = [];

    public mainChartData: Array<any> = [
      {
        data: this.mainChartData1,
        label: 'Sales'
      },
      {
        data: this.mainChartData3,
        label: 'Price'
      }
    ];
    /* tslint:disable:max-line-length */
    // public mainChartLabels: Array<any> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    public mainChartLabels: Array<any> = [];
    /* tslint:enable:max-line-length */
    public mainChartOptions: any = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips,
        intersect: true,
        mode: 'index',
        position: 'nearest',
        callbacks: {
          labelColor: function(tooltipItem, chart) {
            return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: false,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            stepSize: Math.ceil(150 / 5),
            max: 150
          }
        }]
      },
      elements: {
        line: {
          borderWidth: 2
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        }
      },
      legend: {
        display: false
      }
    };
    public mainChartColours: Array<any> = [
      { // brandInfo
        backgroundColor: hexToRgba(getStyle('--info'), 10),
        borderColor: getStyle('--info'),
        pointHoverBackgroundColor: '#fff'
      },
      { // brandSuccess
        backgroundColor: 'transparent',
        borderColor: getStyle('--success'),
        pointHoverBackgroundColor: '#fff'
      },
      { // brandDanger
        backgroundColor: 'transparent',
        borderColor: getStyle('--danger'),
        pointHoverBackgroundColor: '#fff',
        borderWidth: 1,
        borderDash: [8, 5]
      }
    ];
    public mainChartLegend = false;
    public mainChartType = 'line';

    public random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    constructor(private datePipe: DatePipe) {

    }

    ngOnInit(): void {
        // generate random values for mainChart
        for (let i = 0; i < this.mainChartElements; i++) {
          this.mainChartData1.push(this.random(50, 150));
          this.mainChartData3.push(this.random(5, 20));
          const dte = new Date();
          dte.setDate(dte.getDate() - (6 - i));
          this.mainChartLabels[i] = this.datePipe.transform(dte, 'dd-MMM-yyyy');
        }
        this.sales = this.random(100, 200);
    }
}
