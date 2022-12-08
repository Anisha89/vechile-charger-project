import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { MapComponent } from './map.component';
import { MapRoutingModule } from './map-routing.module';
import { CommonModule } from '@angular/common';
import { AgmLocationMarkerDirective } from './agm-location-marker.component';
import { ChargingVehicleModule } from '../admin/charging-vehicle';
import { ChargingTerminalModule } from '../admin/charging-terminal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { environment } from '../../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MapRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places']
    }),
    AgmDirectionModule,
    ChargingVehicleModule,
    ChargingTerminalModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [ MapComponent, AgmLocationMarkerDirective ]
})
export class MapModule { }
