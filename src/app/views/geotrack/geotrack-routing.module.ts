import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { GeotrackComponent } from './geotrack.component';

const routes: Routes = [
  {
    path: '',
    component: GeotrackComponent,
    data: {
      title: 'Geotrack'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeotrackRoutingModule {}
