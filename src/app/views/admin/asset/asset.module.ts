import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AgmCoreModule } from '@agm/core';

import { AssetsComponent } from './list/assets.component';
import { AssetService } from './asset.service';
import { AssetRoutingModule } from './asset-routing.module';
import { AssetComponent } from './detail/asset.component';
import { AssetValidator } from './detail/asset.validator';
import { LoadingModule } from '../../../component/loading/loadin.module';
import { PaginationModule } from '../../../component/pagination/pagination.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TabsModule,
        ModalModule.forRoot(),
        AssetRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC2M9mZet7ZI24632ugbnRc3gFHJGMYMrI',
            libraries: ['places']
        }),
        LoadingModule,
        PaginationModule
    ],
    declarations: [
        AssetsComponent,
        AssetComponent
    ],
    exports: [
        AssetsComponent,
        AssetComponent
    ],
    providers: [
        AssetService,
        AssetValidator
    ]
})
export class AssetModule {

}
