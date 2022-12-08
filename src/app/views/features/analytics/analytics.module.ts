import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Analytics1Component } from './analytics1/analytics1.component';
import { Analytics2Component } from './analytics2/analytics2.component';
import { Analytics3Component } from './analytics3/analytics3.component';
import { Analytics4Component } from './analytics4/analytics4.component';
import { Analytics5Component } from './analytics5/analytics5.component';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { DomainAnalyticsComponent } from './domainanalytics/domain-analytics.component';
import { LoadingModule } from '../../../component/loading/loadin.module';

@NgModule({
imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AnalyticsRoutingModule,
    LoadingModule
],
declarations: [
    Analytics1Component,
    Analytics2Component,
    Analytics3Component,
    Analytics4Component,
    Analytics5Component,
    DomainAnalyticsComponent
],
exports: [
    Analytics1Component,
    Analytics2Component,
    Analytics3Component,
    Analytics4Component,
    Analytics5Component
],
providers: [
]
})

export class AnalyticsModule {

}
