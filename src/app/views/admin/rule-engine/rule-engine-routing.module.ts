import { Routes, RouterModule } from '@angular/router';
import { RulesComponent } from './list/rules.component';
import { NgModule } from '@angular/core';
import { RuleComponent } from './detail/rule.component';
import { NewruleComponent } from './newrule/newrule.component';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'Rule Engine'
    },
    children: [
    {
        path: '',
        redirectTo: 'newrule'
    },
    {
        path: 'newrule',
        component: NewruleComponent,
        data: {
        title: 'New Rule'
        }
    }
  
]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RuleEngineRoutingModule {

}
