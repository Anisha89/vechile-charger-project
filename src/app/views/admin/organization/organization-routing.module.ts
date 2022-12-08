import { Routes, RouterModule } from '@angular/router';
import { OrganizationsComponent } from './list/organizations.component';
import { NgModule } from '@angular/core';
import { OrganizationComponent } from './detail/organization.component';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'Organization'
    },
    children: [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: 'list',
        component: OrganizationsComponent,
        data: {
        title: 'List'
        }
    },
    {
        path: 'add',
        component: OrganizationComponent,
        data: {
        title: 'Add'
        }
    },
    {
        path: 'edit',
        component: OrganizationComponent,
        data: {
        title: 'Edit'
        }
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationRoutingModule {

}