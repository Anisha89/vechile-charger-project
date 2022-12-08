import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {
    QueryBuilderComponent,
    QueryInputDirective,
    QueryFieldDirective,
    QueryEntityDirective,
    QueryOperatorDirective,
    QueryUnitDirective,
    QueryThresholdDirective,
    QueryButtonGroupDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    QueryEmptyWarningDirective
} from './components';

import { QueryBuilderContext } from './components/query-builder/query-builder.context';
import { SafeHtmlPipe } from './components/query-builder/safe-html.pipe';
import { AngularResizedEventModule } from 'angular-resize-event';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    AngularResizedEventModule,
    AngularMultiSelectModule
  ],
  declarations: [
    QueryBuilderComponent,
    QueryInputDirective,
    QueryOperatorDirective,
    QueryUnitDirective,
    QueryThresholdDirective,
    QueryFieldDirective,
    QueryEntityDirective,
    QueryButtonGroupDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    QueryEmptyWarningDirective,
    SafeHtmlPipe
  ],
  exports: [
    AngularMultiSelectModule,
    QueryBuilderComponent,
    QueryInputDirective,
    QueryOperatorDirective,
    QueryUnitDirective,
    QueryThresholdDirective,
    QueryFieldDirective,
    QueryEntityDirective,
    QueryButtonGroupDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    QueryEmptyWarningDirective,
    SafeHtmlPipe
  ],
  providers: [
    QueryBuilderContext
  ]
})
export class QueryBuilderModule { }
