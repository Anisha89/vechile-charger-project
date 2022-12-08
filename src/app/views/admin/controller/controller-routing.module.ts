import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ControllersComponent } from './list/controllers.component';
import { ControllerComponent } from './detail/controller.component';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'Controller'
    },
    children: [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: 'list',
        component: ControllersComponent,
        data: {
        title: 'List'
        }
    },
    {
        path: 'add',
        component: ControllerComponent,
        data: {
        title: 'Add'
        }
    },
    {
        path: 'edit',
        component: ControllerComponent,
        data: {
        title: 'Edit'
        }
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ControllerRoutingModule {

}