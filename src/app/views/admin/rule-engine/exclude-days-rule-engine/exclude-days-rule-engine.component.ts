import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output, Injector, ViewChild, ElementRef } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'underscore';
import * as moment from 'moment';

@Component({
    selector: 'app-exclude-days-rule-engine',
    templateUrl: './exclude-days-rule-engine.component.html',
    styleUrls: ['./exclude-days-rule-engine.component.scss']
})
// This is just copy of Exclude Days Component with little modification for Rule Engine
export class ExcludeDaysRuleEngineComponent implements OnInit, OnChanges {

    @ViewChild('selectedDaysSection') selectedDaysSection:  ElementRef<any>;
    @Input() days = [];
    @Input() excludedDays = [];
    @Input() min: any;
    @Input() max: any;
    @Input() disabled: boolean;
    @Output() public selected: EventEmitter<any> = new EventEmitter();
    height = 35;
    constructor(injector: Injector) {
    }

    ngOnInit() {
        const that = this;
        jQuery('.picker').on('change', function () {
            jQuery('#exd-date-type').val(jQuery(this).val());
            that.parseDate(jQuery(this).val().toString());
        });

       // this.height = 40;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.excludedDays) {
            this.excludedDays.forEach((element, index) => {
                let strDate = this.getUserTimeZoneDate(element).format('MM/DD/YYYY');
                if (strDate != "Invalid date") { // this part need to fixed properly.
                    this.excludedDays[index] = strDate;
                }
            });
        }
    }

    parseDate(dateString: string) {
        const year = moment(dateString).format('YYYY');
        if (Number(year[0]) !== 0 && dateString) {
            const date = moment(dateString).format('MM/DD/YYYY');
            if (!this.excludedDays.includes(date)) {
                this.excludedDays.push(date);
                this.selected.next(this.excludedDays);
            }
            (<HTMLInputElement>document.getElementById('exd-date-type')).value = null;

        }
    }

    removeDate(index) {
        this.excludedDays.splice(index, 1);
        this.selected.next(this.excludedDays);
    }

    getUserTimeZoneDate(value) {
        const convertedTimezone = moment.utc(value).local();
        return convertedTimezone;
    }

    onDateInputClick($event) {
        const e = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'F4',
            shiftKey: true,
            code: 'F4'
        });
        const ev = document.createEvent('KeyboardEvent');
    }

    clickedOnDiv() {
        const element = <HTMLElement>document.getElementById('exd-date-type');
        element.focus();
        element.click();
    }


    eventTriggered($event) {
        console.log('event', $event );
    }

    getMinHeightForInput() {
        if (this.selectedDaysSection  && this.selectedDaysSection.nativeElement) {
            this.height = this.selectedDaysSection.nativeElement.offsetHeight;
            if (this.height < 35) {
                this.height = 35;
            } else {
                this.height = this.height + 5;
            }
        }

        return this.height;
    }

}
