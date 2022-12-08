import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AgmCoreModule } from '@agm/core';

import { OrganizationsComponent } from './list/organizations.component';
import { OrganizationService } from './organization.service';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationComponent } from './detail/organization.component';
import { OrganizationValidator } from './detail/organization.validator';
import { LoadingModule } from '../../../component/loading/loadin.module';
import { PaginationModule } from '../../../component/pagination/pagination.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TabsModule,
        ModalModule.forRoot(),
        OrganizationRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyC2M9mZet7ZI24632ugbnRc3gFHJGMYMrI',
            libraries: ['places']
        }),
        LoadingModule,
        PaginationModule
    ],
    declarations: [
        OrganizationsComponent,
        OrganizationComponent
    ],
    exports: [
        OrganizationsComponent,
        OrganizationComponent
    ],
    providers: [
        OrganizationService,
        OrganizationValidator
    ]
})
export class OrganizationModule {

}
