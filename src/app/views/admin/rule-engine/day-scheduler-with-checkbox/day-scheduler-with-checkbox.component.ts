import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-day-scheduler-with-checkbox',
    templateUrl: './day-scheduler-with-checkbox.component.html',
    styleUrls: ['./day-scheduler-with-checkbox.component.scss']
})
export class DaySchedulerWithCheckboxComponent implements OnInit, OnChanges {

    allSelected: boolean;
    @Output() notifyChange = new EventEmitter();
    @Input() data;
    @Input() disabled: boolean;
    public daySchedules = [
        { 'name': 'Mo', 'text': 'Monday', 'sort': 'Mon' },
        { 'name': 'Tu', 'text': 'Tuesday', 'sort': 'Tue' },
        { 'name': 'We', 'text': 'Wednesday', 'sort': 'Wed' },
        { 'name': 'Th', 'text': 'Thursday', 'sort': 'Thu' },
        { 'name': 'Fr', 'text': 'Friday', 'sort': 'Fri' },
        { 'name': 'Sa', 'text': 'Saturday', 'sort': 'Sat' },
        { 'name': 'Su', 'text': 'Sunday', 'sort': 'Sun' }];

    public daySortNameList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    public selectedDayList = [];

    constructor() {
        this.selectedDayList = [];
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.selectedDayList = [];
        if (typeof this.data !== 'string') {
            this.data.forEach((item) => {
                const index = this.daySortNameList.indexOf(item);
                if (index > -1) {
                    this.selectedDayList[index] = true;
                }
            });
        }
    }

    toggleSelectedDay(index) {
        this.selectedDayList[index] = !this.selectedDayList[index];
        const selectedDay = [];
        this.selectedDayList.forEach((data, dataIndex) => {
            if (data) {
                selectedDay.push(this.daySchedules[dataIndex]);
            }
        });
        this.notifyChange.next(selectedDay);
    }


}
