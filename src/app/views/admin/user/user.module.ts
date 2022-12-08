import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UsersComponent } from './list/users.component';
import { UserService } from './user-service';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './detail/user.component';
import { UserValidator } from './detail/user.validator';
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
    UserRoutingModule,
    BsDropdownModule,
    TypeaheadModule.forRoot(),
    LoadingModule,
    PaginationModule,
    NgMultiSelectDropDownModule.forRoot()
],
declarations: [
    UsersComponent,
    UserComponent
],
exports: [
    UsersComponent,
    UserComponent
],
providers: [
    UserService,
    UserValidator
]
})
export class UserModule {

}
