import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetDashboardRoutingModule } from './asset-dashboard-routing.module';
import { AssetDashboardComponent } from './dashboard/asset-dashboard.component';
import { AssetsComponent } from './assets/assets.component';
import { TermialWidgetComponent } from './dashboard/termial-widget';
import { ChargingVehicleModule } from '../../admin/charging-vehicle';
import { ChargingTerminalModule } from '../../admin/charging-terminal';
import { AgmCoreModule } from '@agm/core';
import { SafeHtmlPipe } from './safe-html.pipe';
import { AlarmModule } from '../alarm';
import { ChartsModule } from 'ng2-charts';
import { LoadingModule } from '../../../component/loading/loadin.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC2M9mZet7ZI24632ugbnRc3gFHJGMYMrI'
        }),
        ChartsModule,
        AssetDashboardRoutingModule,
        ChargingVehicleModule,
        ChargingTerminalModule,
        AlarmModule,
        LoadingModule
    ],
    declarations: [
        AssetDashboardComponent,
        AssetsComponent,
        TermialWidgetComponent,
        SafeHtmlPipe
    ],
    exports: [
        AssetDashboardComponent,
        AssetsComponent,
        TermialWidgetComponent
    ],
    providers: [
        DatePipe
    ]
})
export class AssetDashboardModule {

}
