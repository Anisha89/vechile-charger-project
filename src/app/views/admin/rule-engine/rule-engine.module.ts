import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AgmCoreModule } from '@agm/core';
import { RulesComponent } from './list/rules.component';
import { RuleEngineService } from './rule-engine.service';
import { RuleEngineRoutingModule } from './rule-engine-routing.module';
import { RuleComponent } from './detail/rule.component';
import { RuleValidator } from './detail/rule.validator';
import { environment } from '../../../../environments/environment';
import { RuleBuilderModule } from './rule-builder';
import { UnitConversionFormulaService } from './unit-conversion-formula.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { DaySchedulerWithCheckboxComponent } from './day-scheduler-with-checkbox/day-scheduler-with-checkbox.component';
import { ExcludeDaysRuleEngineComponent } from './exclude-days-rule-engine/exclude-days-rule-engine.component';
import { TimeSliderComponent } from './time-slider/time-slider.component';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { RuleTester } from './rule-tester';
import { RuleTestResultComponent } from './rule-test-result/rule-test-result.component';
import { SafeHtmlMainPipe } from './safe-html.pipe';
import { LoadingModule } from '../../../component/loading/loadin.module';
import { PaginationModule } from '../../../component/pagination/pagination.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NewruleComponent } from './newrule/newrule.component';
import { NewRuleValidator } from './newrule/newrule.validator';


@NgModule({

    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule,
        TabsModule,
        ModalModule.forRoot(),
        RuleEngineRoutingModule,
        RuleBuilderModule,
        AngularMultiSelectModule,
        NouisliderModule,
        TagInputModule,
        LoadingModule,
        PaginationModule,
        AgmCoreModule.forRoot({
            apiKey: environment.googleApiKey,
            libraries: ['places']
        })
    ],
    declarations: [
        RulesComponent,
        RuleComponent,
        DaySchedulerWithCheckboxComponent,
        ExcludeDaysRuleEngineComponent,
        TimeSliderComponent,
        RuleTestResultComponent,
        SafeHtmlMainPipe,
        NewruleComponent
    ],
    exports: [
        RulesComponent,
        RuleComponent,
        NewruleComponent
    ],
    providers: [
        RuleEngineService,
        RuleValidator,
        NewRuleValidator,
        UnitConversionFormulaService,
        RuleTester,
        DatePipe,
        SafeHtmlMainPipe
    ]
})
export class RuleEngineModule {

}
