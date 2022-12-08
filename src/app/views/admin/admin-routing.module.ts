import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
{
    path: '',
    data: {
    title: 'Admin'
    },
    children: [
    {
        path: '',
        redirectTo: 'organization'
    },
    {
        path: 'organization',
        loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule)
    },
    {
        path: 'facility',
        loadChildren: () => import('./facility/facility.module').then(m => m.FacilityModule)
    },
    {
        path: 'asset',
        loadChildren: () => import('./asset/asset.module').then(m => m.AssetModule)
    },
    {
        path: 'charging-vehicle',
        loadChildren: () => import('./charging-vehicle/charging-vehicle.module').then(m => m.ChargingVehicleModule)
    },
    {
        path: 'charging-outlet',
        loadChildren: () => import('./charging-terminal/charging-terminal.module').then(m => m.ChargingTerminalModule)
    },
    {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
    },
    {
        path: 'rule-engine',
        loadChildren: () => import('./rule-engine/rule-engine.module').then(m => m.RuleEngineModule)
    },
    {
        path: 'controller',
        loadChildren: () => import('./controller/controller.module').then(m => m.ControllerModule)
    },
    {
        path: 'department',
        loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule)
    },
    {
        path: 'role',
        loadChildren: () => import('./role/role.module').then(m => m.RoleModule)
    }]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {

}
