import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { NouiFormatter } from '../nouislider';
import * as _ from 'underscore';
@Component({
	selector: 'app-date-slider',
	templateUrl: './date-slider.component.html',
	styleUrls: ['./date-slider.component.scss']
})
export class DateSliderComponent implements OnInit, AfterViewInit {

	@Output() private dateRange: EventEmitter<string[]> = new EventEmitter();

	@Input() private range: number[] = this.range ? this.range : [0, 0];

	private dateArr: string[] = [];

	private rangeConfig: any;

	public displayDate: any[] = [];

	@ViewChild('sliderRef') sliderRef: ElementRef;
	private formatter: NouiFormatter = {

		from(value: string): number {
			let v = value.split(':').map(parseInt);
			v[0] = v[0] - 1;
			return Math.ceil(v[0]);
		},

		to(value: number): string {

			return Math.ceil(value) + '';
			// + ':00 hrs';
		}

	};
	constructor() { }


	ngOnInit() {
		this.dateArr = this.Last7Days();
		this.rangeConfig = {
			behaviour: 'drag',
			connect: true,
			margin: 0.5,
			range: {
				min: 0,
				max: 7
			},
			format: this.formatter,
		};
		this.onChange(this.range);
	}

	ngAfterViewInit() {

		let label: any[] = this.sliderRef.nativeElement.querySelectorAll('.noUi-value.noUi-value-horizontal.noUi-value-large');
		//changing the label after the view initialization
		label.forEach(function (divison) {
			let i = parseInt(divison.innerText);
			divison.innerText = this.dateArr[i - 1];
		}, this)
	}

	onChange(value: any) { // on change return to selected date array
		let dateRangeArr: string[] = [this.dateArr[value[0] > 0 ? value[0] : 0], this.dateArr[value[1]]];
		this.displayDate = dateRangeArr;
		dateRangeArr.push(value)
		this.dateRange.emit(dateRangeArr);
	}

	formatDate(date: Date): string { // it will create the mm-dd-yyy from js date obj
		let dd: number | string = date.getDate();
		var mm: number | string = date.getMonth() + 1;
		let yyyy = date.getFullYear();
		if (dd < 10) { dd = '0' + dd }
		if (mm < 10) { mm = '0' + mm }
		let formatDate = mm + '/' + dd + '/' + yyyy;
		return formatDate;
	}

	Last7Days(): string[] { // it will produce the array date last 7 days including today
		let result = [];
		for (let i = 6; i >= -1; i--) {
			let d = new Date();
			d.setDate(d.getDate() - i);
			result.push(this.formatDate(d))
		}
		return result;
	}

	createFormatter(date: string[]): NouiFormatter { // it create format while hover

		return {

			from(value: string): number {

				return _.findIndex(date, function (dat) { return dat == value; });
			},

			to(value: number): string {
				return date[Math.ceil(value) - 1];
			}

		}
	}
}
