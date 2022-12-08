import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppContext } from '../../../../app.context';
import { ChargingTerminal } from '../../../../models/charging-terminal.model';
import { AlarmService } from '../alarm.service';
import { Alarm } from '../../../../models/alarm.modal';

@Component({
    selector: 'app-alarms',
    templateUrl: 'alarms.component.html',
    styleUrls: ['alarms.component.scss']
})

export class AlarmsComponent implements OnInit {


    @ViewChild('deleteConfirmationModal')
    public deleteConfirmationModal: ModalDirective;
    @ViewChild('statusChangeModal')
    public statusChangeModal: ModalDirective;

    alarms: Alarm[];
    selected: Alarm;
    selectedChargingTerminal: ChargingTerminal;
    constructor(private service: AlarmService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
            this.service.getAll().subscribe(alarms => {
                this.alarms = alarms;
            }, error => {
                // TODO display error
                console.log(error);
            });
    }


    select(selected: Alarm, $event?: any) {
        this.selected = selected;
    }

    delete(selectedChargingTerminal: ChargingTerminal) {
        this.deleteConfirmationModal.hide();
        this.service.delete(selectedChargingTerminal.id).subscribe(alarms => {
            this.alarms = alarms;
        });
    }

    checkAndDelete(chargingTerminal: ChargingTerminal, $event?: any) {
        this.deleteConfirmationModal.show();
    }

    confirmAndChangeStatus(alarm: Alarm, $event) {
        this.select(alarm, $event);
        alarm.status = alarm.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
        this.statusChangeModal.show();
    }

    onStatusChange(alarm: Alarm, $event: any) {
        this.statusChangeModal.hide();
        this.service.update(alarm).subscribe(updatedAlarm => {

        });
    }

    cancelStatusChange(alarm: Alarm) {
        this.statusChangeModal.hide();
        alarm.status = alarm.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    }

    void() {

    }
}
