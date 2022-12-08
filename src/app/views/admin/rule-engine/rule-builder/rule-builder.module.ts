import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RuleBuilderComponent } from './rule-builder.component';
import { QueryBuilderModule } from './query-builder';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        QueryBuilderModule
    ],
    declarations: [
        RuleBuilderComponent
    ],
    exports: [
        RuleBuilderComponent
    ],
    providers: [
    ]
})
export class RuleBuilderModule {

}
