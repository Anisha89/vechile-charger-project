import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { NouiFormatter } from './nouislider';

@Component({
  selector: 'app-time-slider',
  templateUrl: './time-slider.component.html',
  styleUrls: ['./time-slider.component.scss']
})
export class TimeSliderComponent implements OnInit, OnChanges {

  public displayHr: any[] = [];

  @Output() timeRange: EventEmitter<number[]> = new EventEmitter();

  @Input() range: number[] = [0, 2];//this.range ? this.range : [0, 2];

  formatter: NouiFormatter = {
    from(value: string): number {
      let v = value.split(':').map(parseInt);
      return Math.ceil(v[0]);
    },

    to(value: number): string {
      return Math.ceil(value) + '';
      // + ':00 hrs';
    }

  };

  public rangeConfig: any = {
    behaviour: 'drag',
    connect: true,
    margin: 1,
    range: {
      min: 0,
      max: 24
    },
    // pips: {
    //   mode: 'steps',
    //   density: 80
    // },
    format: this.formatter,
    // tooltips: true
  };
  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.range) {
      this.onChange(this.range);
    }
  }

  onChange(value: number[]) {
    this.displayHr = [value[0], value[1]];
    this.timeRange.emit(value);
  }



}
