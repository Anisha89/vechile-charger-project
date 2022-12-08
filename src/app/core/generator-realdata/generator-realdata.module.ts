import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratorRealdataComponent } from './generator-realdata.component';
import { DataTableModule } from 'angular2-datatable';
import { FormsModule } from '@angular/forms';
import {CoreModule} from "../core.module";



@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    DataTableModule,
    FormsModule
  ],
  declarations: [GeneratorRealdataComponent],
  exports : [GeneratorRealdataComponent]
})
export class generatorRealDataModule { }
