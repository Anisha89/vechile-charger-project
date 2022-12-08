import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FacilitiesComponent } from './list/facilities.component';
import { FacilityComponent } from './detail/facility.component';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'Facility'
    },
    children: [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: 'list',
        component: FacilitiesComponent,
        data: {
        title: 'List'
        }
    },
    {
        path: 'add',
        component: FacilityComponent,
        data: {
        title: 'Add'
        }
    },
    {
        path: 'edit',
        component: FacilityComponent,
        data: {
        title: 'Edit'
        }
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FacilityRoutingModule {

}