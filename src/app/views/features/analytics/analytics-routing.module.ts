import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { Analytics1Component } from './analytics1/analytics1.component';
import { Analytics2Component } from './analytics2/analytics2.component';
import { Analytics3Component } from './analytics3/analytics3.component';
import { Analytics4Component } from './analytics4/analytics4.component';
import { Analytics5Component } from './analytics5/analytics5.component';
import { DomainAnalyticsComponent } from './domainanalytics/domain-analytics.component';

const routes: Routes = [
    {
        path: '',
        data: {
        title: 'Analytics'
        },
        children: [
        {
            path: '',
            redirectTo: '1'
        },
        {
            path: '1',
            component: Analytics1Component,
            data: {
            title: 'Analytics 1'
            }
        },
        {
            path: '2',
            component: Analytics2Component,
            data: {
            title: 'Analytics 2'
            }
        },
        {
            path: '3',
            component: Analytics3Component,
            data: {
            title: 'Analytics 3'
            }
        },
        {
            path: '4',
            component: Analytics4Component,
            data: {
            title: 'Analytics 4'
            }
        },
        {
            path: '5',
            component: Analytics5Component,
            data: {
            title: 'Analytics 5'
            }
        },
        {
            path: 'domain',
            // component: Analytics5Component,
            data: {
            title: 'Custom Domain Analytics'
            },
            children : [
                {
                    path: '',
                    redirectTo: '99'
                },
                {
                    path: ':domainId',
                    component: DomainAnalyticsComponent,
                    data: {
                    title: 'Custom Domain Analytics 123'
                    }
                }
            ]
        }]
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AnalyticsRoutingModule {

}
