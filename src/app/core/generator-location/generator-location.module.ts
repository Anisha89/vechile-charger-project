import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GeneratorLocationComponent} from "./generator-location.component";
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../../environments/environment';
import { AppCommonModule } from '../../app-common';




@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    AgmCoreModule
  ],
  declarations: [
    GeneratorLocationComponent
  ],
  exports: [
    GeneratorLocationComponent
  ]


})
export class GeneratorLocationModule { }
