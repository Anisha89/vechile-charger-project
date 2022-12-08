import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
 

  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./views/admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'features',
        loadChildren: () => import('./views/features/features.module').then(m => m.FeaturesModule)
      },
      {
        path: 'map',
        loadChildren: () => import('./views/map/map.module').then(m => m.MapModule)
      },
    
      {
        path: 'geotrack',
        loadChildren: () => import('./views/geotrack/geotrack.module').then(m => m.GeotrackModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
