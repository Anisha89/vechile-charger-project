import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DepartmentsComponent } from './list/department.component';
import { DepartmentService } from './department-service';
import { DepartmentRoutingModule } from './department-routing.module';
import { DepartmentComponent } from './detail/department.component';
import { DepartmentValidator } from './detail/department.validator';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { LoadingModule } from '../../../component/loading/loadin.module';
import { PaginationModule } from '../../../component/pagination/pagination.module';
@NgModule({
imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    ModalModule.forRoot(),
    DepartmentRoutingModule,
    BsDropdownModule,
    TypeaheadModule.forRoot(),
    LoadingModule,
    PaginationModule
],
declarations: [
    DepartmentsComponent,
    DepartmentComponent
],
exports: [
    DepartmentsComponent,
    DepartmentComponent
],
providers: [
    DepartmentService,
    DepartmentValidator
]
})
export class DepartmentModule {

}
