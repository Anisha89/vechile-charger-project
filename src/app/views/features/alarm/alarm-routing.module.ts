import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AlarmsComponent } from './list/alarms.component';

const routes: Routes = [
    {
        path: '',
        data: {
        title: 'Alarm'
        },
        children: [
        {
            path: '',
            redirectTo: 'list'
        },
        {
            path: 'list',
            component: AlarmsComponent,
            data: {
            title: 'List'
            }
        },
        {
            path: 'add',
            component: null,
            data: {
            title: 'Add'
            }
        },
        {
            path: 'edit',
            component: null,
            data: {
            title: 'Edit'
            }
        }]
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AlarmRoutingModule {

}
