import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlarmsComponent } from './list/alarms.component';
import { AlarmService } from './alarm.service';
import { AlarmRoutingModule } from './alarm-routing.module';

@NgModule({
imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AlarmRoutingModule
],
declarations: [
    AlarmsComponent
],
exports: [
    AlarmsComponent,
],
providers: [
    AlarmService,
]
})

export class AlarmModule {

}
