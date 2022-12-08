import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChargingTerminalsComponent } from './list/charging-terminals.component';
import { ChargingTerminalComponent } from './detail/charging-terminal.component';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'Charging Outlet'
    },
    children: [
    {
        path: 'list',
        component: ChargingTerminalsComponent,
        data: {
        title: 'List'
        }
    },
    {
        path: 'add',
        component: ChargingTerminalComponent,
        data: {
        title: 'Add'
        }
    },
    {
        path: 'edit',
        component: ChargingTerminalComponent,
        data: {
        title: 'Edit'
        }
    },
    {
        path: '',
        redirectTo: 'list'
    },
]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChargingTerminalRoutingModule {

}