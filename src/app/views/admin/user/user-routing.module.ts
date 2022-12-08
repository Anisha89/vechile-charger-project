import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsersComponent } from './list/users.component';
import { UserComponent } from './detail/user.component';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'User'
    },
    children: [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: 'list',
        component: UsersComponent,
        data: {
        title: 'List'
        }
    },
    {
        path: 'add',
        component: UserComponent,
        data: {
        title: 'Add'
        }
    },
    {
        path: 'edit',
        component: UserComponent,
        data: {
        title: 'Edit'
        }
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {

}