import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/base.service';
import { Observable } from 'rxjs';
import { Alarm } from '../../../models/alarm.modal';
import * as moment from 'moment';
import { AppService } from '../../../app.service';
import { AppContext } from '../../../app.context';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class AlarmService extends BaseService {

    constructor(
        appContext: AppContext,
        http: HttpClient
    ) {
        super(appContext, http);
        this.initilize()
    }

    getAll(): Observable<any> {
        return this._get(`alarm`);
    }

    create(alarm: Alarm): Observable<any> {
        return this._post(`alarm`, alarm);
    }

    update(alarm: Alarm): Observable<any> {
        return this._put(`alarm`, alarm);
    }

    delete(alarmId: string): Observable<any> {
        return this._delete(`alarm/${alarmId}`);
    }

    initilize(){
        const usaTime: Date = new Date();
        const dateTime1  = moment(usaTime).subtract('5', 'minutes');
        const dateTime2 = moment(usaTime).subtract('10', 'minutes');
        const dateTime3 = moment(usaTime).subtract('15', 'minutes');
        const dateTime4  = moment(usaTime).subtract('20', 'minutes');
        const alarms: Alarm[] = [
            {
                id: this.generateId(),
                alarm: 'Connection',
                chargingTerminal: 'RFVC30GRYHM',
                chargingVehicle: 'J1772COMBO',
                description: 'Outlet 3 is connected',
                facility: 'EV Charging Station',
                normalizedTime: null,
                priority: 1,
                status: 'ACTIVE',
                triggerTime: dateTime1.toDate()
            },
            {
                id: this.generateId(),
                alarm: 'Vehicle Movement',
                chargingTerminal: 'RFSVC40GRYHM',
                chargingVehicle: 'J1772JUMBO',
                description: 'Vehicle 2 is moving out of the current position',
                facility: 'EV Charging Station',
                normalizedTime: dateTime2.add('2', 'minutes').toDate(),
                priority: 2,
                status: 'NORMAL',
                triggerTime: dateTime2.toDate()
            },
            {
                id: this.generateId(),
                alarm: 'Vehicle 2 has reached Broadway, NY',
                chargingTerminal: 'RFSVC30GRYHM',
                chargingVehicle: 'EVSJ8c4u93K',
                description: ' Vehicle Movement',
                facility: 'Manhattan Charging Facility',
                normalizedTime: dateTime3.add('2', 'minutes').toDate(),
                priority: 3,
                status: 'NORMAL',
                triggerTime: dateTime3.toDate()
            },
            {
                id: this.generateId(),
                alarm: 'Connection',
                chargingTerminal: 'FAS1200EVS',
                chargingVehicle: 'TSREiLK4ct',
                description: 'Outlet 2 is connected',
                facility: 'Manhattan Charging Facility',
                normalizedTime: dateTime4.add('2', 'minutes').toDate(),
                priority: 4,
                status: 'NORMAL',
                triggerTime: dateTime4.toDate()
            }
        ] as Alarm [];

        this.setItems('alarm', alarms, false);
    }
}
