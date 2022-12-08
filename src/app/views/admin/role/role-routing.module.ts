import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RolesComponent } from './list/roles.component';
import { RoleComponent } from './detail/role.component';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'Role'
    },
    children: [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: 'list',
        component: RolesComponent,
        data: {
        title: 'List'
        }
    },
    {
        path: 'add',
        component: RoleComponent,
        data: {
        title: 'Add'
        }
    },
    {
        path: 'edit',
        component: RoleComponent,
        data: {
        title: 'Edit'
        }
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleRoutingModule {

}