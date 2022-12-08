import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RolesComponent } from './list/roles.component';
import { RoleService } from './role-service';
import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './detail/role.component';
import { RoleValidator } from './detail/role.validator';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { LoadingModule } from '../../../component/loading/loadin.module';
import { PaginationModule } from '../../../component/pagination/pagination.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    ModalModule.forRoot(),
    RoleRoutingModule,
    BsDropdownModule,
    TypeaheadModule.forRoot(),
    LoadingModule,
    NgMultiSelectDropDownModule.forRoot(),

    PaginationModule
],
declarations: [
    RolesComponent,
    RoleComponent
],
exports: [
    RolesComponent,
    RoleComponent
],
providers: [
    RoleService,
    RoleValidator
]
})
export class RoleModule {

}
