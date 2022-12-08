import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChargingVehiclesComponent } from './list/charging-vehicles.component';
import { ChargingVehicleComponent } from './detail/charging-vehicle.component';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'Charging Vehicle'
    },
    children: [
    {
        path: '',
        redirectTo: 'list'
    },
    {
        path: 'list',
        component: ChargingVehiclesComponent,
        data: {
        title: 'List'
        }
    },
    {
        path: 'add',
        component: ChargingVehicleComponent,
        data: {
        title: 'Add'
        }
    },
    {
        path: 'edit',
        component: ChargingVehicleComponent,
        data: {
        title: 'Edit'
        }
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChargingVehicleRoutingModule {

}