import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AgmCoreModule } from '@agm/core';

import { AssetsDashboardComponentNew } from './list/assetsdashboard.component';
import { AssetDashboardServiceNew } from './assetdashboard.service';
import { AssetDashboardRoutingModuleNew } from './assetdashboard-routing.module';
import { AssetDashboardComponentNew } from './detail/assetdashboard.component';
import { AssetDashboardValidatorNew } from './detail/assetdashboard.validator';
import { LoadingModule } from '../../../component/loading/loadin.module';
import { GoogleMapsModule } from '@angular/google-maps'
import { PaginationModule } from '../../../component/pagination/pagination.module';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { environment } from '../../../../environments/environment';
import {DragDropModule} from '@angular/cdk/drag-drop';





@NgModule({
    imports: [
        CommonModule,
        DragDropModule,
        FormsModule,
       
        ReactiveFormsModule,
        TabsModule,
        NgxChartsModule,
        GoogleMapsModule,
          ModalModule.forRoot(),
        AssetDashboardRoutingModuleNew,
        AgmCoreModule.forRoot({
            apiKey: 
            environment.googleApiKey,
           libraries: ['places']
        }),
        LoadingModule,
        PaginationModule
    ],
    declarations: [
        AssetsDashboardComponentNew,
        AssetDashboardComponentNew
    ],
    exports: [
        AssetsDashboardComponentNew,
        AssetDashboardComponentNew
    ],
    providers: [
        AssetDashboardServiceNew,
        AssetDashboardValidatorNew
    ]
})
export class AssetDashboardModuleNew {

}
