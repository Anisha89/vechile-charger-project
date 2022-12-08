import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratorAlarmPointComponent } from './generator-alarm-point.component';
import { DataTableModule } from 'angular2-datatable';
@NgModule({
  imports: [
    CommonModule,
    DataTableModule
  ],
  declarations: [GeneratorAlarmPointComponent],
  exports: [GeneratorAlarmPointComponent]
})
export class GeneratorAlarmPointModule { }
