import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { RoutePlanningComponent  } from './route-planning.component';

const routes: Routes = [
  {
    path: '',
    component: RoutePlanningComponent,
    data: {
      title: 'Route Planning'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutePlanningRoutingModule {}
