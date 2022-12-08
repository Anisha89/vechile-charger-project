import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeaturesRoutingModule } from './features-routing.module';
import { AssetDashboardModule } from './asset-dashboard';
import { AlarmModule } from './alarm';
import { RoutePlanningModule } from './route-planning/route-planning.module';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      FeaturesRoutingModule,
      AssetDashboardModule,
      AlarmModule,
      RoutePlanningModule

    ],
    declarations: []
})
export class FeaturesModule {

}
