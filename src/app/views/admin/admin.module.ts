import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { OrganizationModule } from './organization';
import { FacilityModule } from './facility';
import { ChargingVehicleModule } from './charging-vehicle';
import { ChargingTerminalModule } from './charging-terminal';
import { UserModule } from './user';
import { RuleEngineModule } from './rule-engine';
import { ControllerModule } from './controller/controller.module';
import { RoleModule } from './role';
import { DepartmentModule } from './department';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      OrganizationModule,
      FacilityModule,
      ChargingVehicleModule,
      ChargingTerminalModule,
      UserModule,
      RuleEngineModule,
      AdminRoutingModule,
      ControllerModule,
      DepartmentModule,
      RoleModule
    ]
})
export class AdminModule {

}
