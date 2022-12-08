import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'Features'
    },
    children: [
   
    {
        path: 'asset-dashboard',
        loadChildren: () => import('./asset-dashboard/asset-dashboard.module').then(m => m.AssetDashboardModule)
    },
    {
        path: 'assetdashboard',
        loadChildren: () => import('./assetsdashboard/assetdashboard.module').then(m => m.AssetDashboardModuleNew)
    },
    {
        path: 'alarm',
        loadChildren: () => import('./alarm/alarm.module').then(m => m.AlarmModule)
    },
    {
        path: 'analytics',
        loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule)
    },
    {
        path: 'route-planning',
        loadChildren: () => import('./route-planning/route-planning.module').then(m => m.RoutePlanningModule)
    }
]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeaturesRoutingModule {

}
