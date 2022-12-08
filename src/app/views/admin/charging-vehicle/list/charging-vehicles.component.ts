import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ChargingVehicleService } from '../charging-vehicle.service';
import { ChargingVehicle } from '../../../../models/charging-vehicle.model';
import { Organization } from '../../../../models';
import { Facility } from '../../../../models/facility.model';

@Component({
    selector: 'app-charging-vehicles',
    templateUrl: 'charging-vehicles.component.html',
    styleUrls: ['charging-vehicles.component.scss']
})

export class ChargingVehiclesComponent implements OnInit {
    @Input() data: ChargingVehicle[];
    @Input() parent: Facility;

    @ViewChild('deleteconfirmationModal')
    public deleteconfirmationModal: ModalDirective;
    @ViewChild('statusChangeModal')
    public statusChangeModal: ModalDirective;

    chargingVehicles: ChargingVehicle[];
    selected: ChargingVehicle;
    currentOrganization: Organization;
    constructor(private service: ChargingVehicleService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.currentOrganization = this.context.get('current-organization');
        if (this.data) {
            this.chargingVehicles = this.data;
        } else {
            this.service.getByOrganization(this.currentOrganization.id).subscribe(chargingVehicles => {
                this.chargingVehicles = chargingVehicles;
            }, error => {
                // TODO display error
                console.log(error);
            });
        }
    }

    select(selected: ChargingVehicle, $event?: any) {
        this.selected = selected;
    }

    add($event: any) {
        // Initialize the default values here.
        const chargingVehicle: ChargingVehicle = {
            organizationId: this.currentOrganization.id,
            location: {},
            address: '',
            status: 'ACTIVE',
            assetType: 'Light EV Charging Vehicle'
        } as ChargingVehicle;
        if (this.parent != null) {
            chargingVehicle.facilityId = this.parent.id;
        }
        this.select(chargingVehicle, $event);
        this.context.set('selected-chargingVehicle', chargingVehicle);
        this.router.navigate(['/admin/charging-vehicle/add'], {relativeTo: this.route});
    }

    delete(selectedChargingVehicle: ChargingVehicle) {
        this.service.delete(selectedChargingVehicle.id).subscribe(facilities => {
            this.chargingVehicles = facilities;
        });
        this.deleteconfirmationModal.hide();
    }

    checkAndDelete(asset, $event) {
        this.deleteconfirmationModal.show();
    }

    edit(selected: ChargingVehicle, $event?: any) {
        this.select(selected, $event);
        this.context.set('selected-chargingVehicle', selected);
        this.router.navigate(['/admin/charging-vehicle/edit']);
    }

    showDashboard(selected: ChargingVehicle, $event: any) {
        this.select(selected, $event);
        this.context.set('selected-chargingVehicle', selected);
        this.router.navigate(['/features/asset-dashboard/dashboard']);
    }

    confirmAndChangeStatus(chargingVehicle: ChargingVehicle, $event) {
        this.select(chargingVehicle, $event);
        chargingVehicle.status = chargingVehicle.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
        this.statusChangeModal.show();
    }

    onStatusChange(chargingVehicle: ChargingVehicle, $event: any) {
        this.statusChangeModal.hide();
        this.service.update(chargingVehicle).subscribe(updatedChargingVehicle => {

        });
    }

    cancelStatusChange(chargingVehicle: ChargingVehicle) {
        this.statusChangeModal.hide();
        chargingVehicle.status = chargingVehicle.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    }

    void() {
        
    }

}
