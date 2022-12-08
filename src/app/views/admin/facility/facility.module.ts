import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FacilityComponent } from './detail/facility.component';
import { FacilitiesComponent } from './list/facilities.component';
import { FacilityRoutingModule } from './facility-routing.module';
import { FacilityService } from './facility-service';
import { FacilityValidator } from './detail/facility.validator';
import { ChargingVehicleModule } from '../charging-vehicle';
import { LoadingModule } from '../../../component/loading/loadin.module';
import { PaginationModule } from '../../../component/pagination/pagination.module';
@NgModule({
imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    ModalModule.forRoot(),
    FacilityRoutingModule,
    ChargingVehicleModule,
    LoadingModule,
    PaginationModule
],
declarations: [
    FacilityComponent,
    FacilitiesComponent
],
exports: [
    FacilityComponent,
    FacilitiesComponent
],
providers: [
    FacilityService,
    FacilityValidator,
]
})
export class FacilityModule {

}
