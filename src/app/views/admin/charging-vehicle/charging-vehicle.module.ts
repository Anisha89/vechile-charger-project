import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ChargingVehicleService } from './charging-vehicle.service';
import { ChargingVehicleValidator } from './detail/charging-vehicle.validator';
import { ChargingVehicleComponent } from './detail/charging-vehicle.component';
import { ChargingVehiclesComponent } from './list/charging-vehicles.component';
import { ChargingVehicleRoutingModule } from './charging-vehicle-routing.module';
import { ChargingTerminalModule } from '../charging-terminal';

@NgModule({
imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    ModalModule.forRoot(),
    ChargingVehicleRoutingModule,
    BsDropdownModule,
    ChargingTerminalModule
],
declarations: [
    ChargingVehicleComponent,
    ChargingVehiclesComponent
],
exports: [
    ChargingVehicleComponent,
    ChargingVehiclesComponent,
],
providers: [
    ChargingVehicleService,
    ChargingVehicleValidator,
]
})
export class ChargingVehicleModule {

}
