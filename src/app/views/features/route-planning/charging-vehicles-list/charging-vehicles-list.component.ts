import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ChargingVehicle } from '../../../../models/charging-vehicle.model';
import { Organization } from '../../../../models';
import { Facility } from '../../../../models/facility.model';
import { ChargingVehicleService } from '../../../admin/charging-vehicle/charging-vehicle.service';

@Component({
    selector: 'app-charging-vehicles-list',
    templateUrl: 'charging-vehicles-list.component.html',
    styleUrls: ['charging-vehicles-list.component.scss']
})

export class ChargingVehiclesListComponent implements OnInit, OnChanges {
    @Input() data: ChargingVehicle[];
    @Input() parent: Facility;

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

    ngOnChanges() {
        this.chargingVehicles = this.data;
    }

    select(selected: ChargingVehicle, $event?: any) {
        this.selected = selected;
    }


    showDashboard(selected: ChargingVehicle, $event: any) {
        this.select(selected, $event);
        this.context.set('selected-chargingVehicle', selected);
        this.router.navigate(['/features/asset-dashboard/dashboard']);
    }

}
