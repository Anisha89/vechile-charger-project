import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DepartmentsComponent } from './list/department.component';
import { DepartmentComponent } from './detail/department.component';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'Department'
    },
    children: [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: 'list',
        component: DepartmentsComponent,
        data: {
        title: 'List'
        }
    },
    {
        path: 'add',
        component: DepartmentComponent,
        data: {
        title: 'Add'
        }
    },
    {
        path: 'edit',
        component: DepartmentComponent,
        data: {
        title: 'Edit'
        }
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepartmentRoutingModule {

}