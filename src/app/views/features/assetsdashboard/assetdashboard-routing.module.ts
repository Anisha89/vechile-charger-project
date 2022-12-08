import { Routes, RouterModule } from '@angular/router';
import { AssetsDashboardComponentNew } from './list/assetsdashboard.component';
import { NgModule } from '@angular/core';
import { AssetDashboardComponentNew } from './detail/assetdashboard.component';
import { AssetComponent } from '../../admin/asset/detail/asset.component';
import { AssetsComponent } from '../../admin/asset/list';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'AssetDashboard'
    },
    children: [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: 'list',
        component: AssetsDashboardComponentNew,
        data: {
        title: 'list'
        }
    },
    {
        path: 'view',
        component: AssetDashboardComponentNew,
        data: {
        title: 'view'
        }
    }
    ]
}];


@NgModule({
    
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssetDashboardRoutingModuleNew {

}