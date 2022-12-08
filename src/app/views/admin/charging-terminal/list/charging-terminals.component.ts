import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AppContext } from '../../../../app.context';
import { ChargingTerminal } from '../../../../models/charging-terminal.model';
import { ChargingTerminalService } from '../charging-terminal.service';
import { Organization } from '../../../../models';
import { ChargingVehicle } from '../../../../models/charging-vehicle.model';

@Component({
    selector: 'app-charging-terminals',
    templateUrl: 'charging-terminals.component.html',
    styleUrls: ['charging-terminals.component.scss']
})

export class ChargingTerminalsComponent implements OnInit {

    @Input() data: ChargingTerminal[];
    @Input() parent: ChargingVehicle;

    @ViewChild('deleteConfirmationModal')
    public deleteConfirmationModal: ModalDirective;
    @ViewChild('statusChangeModal')
    public statusChangeModal: ModalDirective;

    chargingTerminals: ChargingTerminal[];
    selected: ChargingTerminal;
    currentOrganization: Organization;
    constructor(private service: ChargingTerminalService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.currentOrganization = this.context.get('current-organization');
        if (this.data) {
            this.chargingTerminals = this.data;
        } else {
            this.service.getByOrganization(this.currentOrganization.id).subscribe(chargingTerminals => {
                this.chargingTerminals = chargingTerminals;
            }, error => {
                // TODO display error
                console.log(error);
            });
        }
    }


    select(selected: ChargingTerminal, $event?: any) {
        this.selected = selected;
    }

    add($event: any) {
        // Initialize the default values here.
        const chargingTerminal: ChargingTerminal = {
            organizationId: this.currentOrganization.id,
            status: 'ACTIVE'
        } as ChargingTerminal;
        if (this.parent != null) {
            chargingTerminal.chargingVehicleId = this.parent.id;
        }
        this.select(chargingTerminal, $event);
        this.context.set('selected-chargingTerminal', chargingTerminal);
        this.router.navigate(['/admin/charging-outlet/add']);
    }

    delete(selectedChargingTerminal: ChargingTerminal) {
        this.deleteConfirmationModal.hide();
        this.service.delete(selectedChargingTerminal.id).subscribe(facilities => {
            this.chargingTerminals = facilities;
        });
    }

    checkAndDelete(chargingTerminal: ChargingTerminal, $event?: any) {
        this.deleteConfirmationModal.show();
    }

    edit(selected: ChargingTerminal, $event?: any) {
        this.select(selected, $event);
        this.context.set('selected-chargingTerminal', selected);
        this.router.navigate(['/admin/charging-outlet/edit']);
    }

    confirmAndChangeStatus(chargingTerminal: ChargingTerminal, $event) {
        this.select(chargingTerminal, $event);
        chargingTerminal.status = chargingTerminal.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
        this.statusChangeModal.show();
    }

    onStatusChange(chargingTerminal: ChargingTerminal, $event: any) {
        this.statusChangeModal.hide();
        this.service.update(chargingTerminal).subscribe(updatedChargingTerminal => {

        });
    }

    cancelStatusChange(chargingTerminal: ChargingTerminal) {
        this.statusChangeModal.hide();
        chargingTerminal.status = chargingTerminal.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    }

    void() {
        
    }
}
