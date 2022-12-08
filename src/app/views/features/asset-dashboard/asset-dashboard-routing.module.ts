import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AssetDashboardComponent } from './dashboard/asset-dashboard.component';
import { AssetsComponent } from './assets/assets.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard'
    },
    {
        path: 'assets',
        component: AssetsComponent,
        data: {
            title: 'Assets'
        }
    },
    {
        path: 'dashboard',
        component: AssetDashboardComponent,
        data: {
            title: 'Dashboard'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssetDashboardRoutingModule {

}
