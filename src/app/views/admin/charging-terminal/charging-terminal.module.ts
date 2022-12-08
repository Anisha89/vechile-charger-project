import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ChargingTerminalRoutingModule } from './charging-terminal-routing.module';
import { ChargingTerminalsComponent } from './list/charging-terminals.component';
import { ChargingTerminalService } from './charging-terminal.service';
import { ChargingTerminalComponent } from './detail/charging-terminal.component';
import { ChargingTerminalValidator } from './detail/charging-terminal.validator';

@NgModule({
imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    ModalModule.forRoot(),
    ChargingTerminalRoutingModule,
    BsDropdownModule
],
declarations: [
    ChargingTerminalComponent,
    ChargingTerminalsComponent
],
exports: [
    ChargingTerminalsComponent,
    ChargingTerminalComponent
],
providers: [
    ChargingTerminalService,
    ChargingTerminalValidator
]
})
export class ChargingTerminalModule {

}
