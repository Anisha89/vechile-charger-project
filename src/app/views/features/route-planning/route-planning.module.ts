import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { RoutePlanningComponent } from './route-planning.component';
import { RoutePlanningRoutingModule } from './route-planning-routing.module';
import { CommonModule } from '@angular/common';
import { AgmLocationMarkerDirective } from './agm-location-marker.component';
import { ChargingVehiclesListComponent } from './charging-vehicles-list/charging-vehicles-list.component';
import { AdminModule } from '../../admin/admin.module';
import { environment } from '../../../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RoutePlanningRoutingModule,
    AdminModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    }),
    AgmDirectionModule
  ],
  declarations: [
    RoutePlanningComponent,
    AgmLocationMarkerDirective,
    ChargingVehiclesListComponent
  ]
})
export class RoutePlanningModule { }
