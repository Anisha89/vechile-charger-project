import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ControllerValidator } from './detail/controller.validator';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ControllerRoutingModule } from './controller-routing.module';
import { ControllersComponent } from './list/controllers.component';
import { ControllerComponent } from './detail/controller.component';
import { ControllerService } from './controller-service';
import { LoadingModule } from '../../../component/loading/loadin.module';
import { PaginationModule } from '../../../component/pagination/pagination.module';

@NgModule({
imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    ModalModule.forRoot(),
    ControllerRoutingModule,
    BsDropdownModule,
    TypeaheadModule.forRoot(),
    LoadingModule,
    PaginationModule
],
declarations: [
    ControllersComponent,
    ControllerComponent
],
exports: [
    ControllersComponent,
    ControllerComponent
],
providers: [
    ControllerService,
    ControllerValidator
]
})
export class ControllerModule {

}
