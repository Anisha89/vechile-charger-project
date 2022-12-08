import { Routes, RouterModule } from '@angular/router';
import { AssetsComponent } from './list/assets.component';
import { NgModule } from '@angular/core';
import { AssetComponent } from './detail/asset.component';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'Asset'
    },
    children: [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: 'list',
        component: AssetsComponent,
        data: {
        title: 'List'
        }
    },
    {
        path: 'add',
        component: AssetComponent,
        data: {
        title: 'Add'
        }
    },
    {
        path: 'edit',
        component: AssetComponent,
        data: {
        title: 'Edit'
        }
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssetRoutingModule {

}