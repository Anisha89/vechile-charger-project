
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ValidationSpec, ValidationError } from '../../../../services/base.validator';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ChargingTerminalValidator } from './charging-terminal.validator';
import { FormControl } from '@angular/forms';
import { ChargingTerminalService } from '../charging-terminal.service';
import { ChargingTerminal } from '../../../../models/charging-terminal.model';
import { ChargingVehicleService } from '../../charging-vehicle/charging-vehicle.service';
import { ChargingVehicle } from '../../../../models/charging-vehicle.model';

@Component({
    selector: 'app-charging-terminal',
    templateUrl: 'charging-terminal.component.html',
    styleUrls: ['charging-terminal.component.scss']
})
export class ChargingTerminalComponent implements OnInit {

    changed: boolean;
    validationErrors: { [key: string]: ValidationError };
    validationSpecs: { [key: string]: ValidationSpec } = {};
    chargingTerminal: ChargingTerminal;
    chargingVehicles: ChargingVehicle[] = [];
    attachedChargingVehicle: ChargingVehicle;
    @ViewChild('descardconfirmationModal')
    public descardconfirmationModal: ModalDirective;

    public addressControl: FormControl = new FormControl();
    constructor(
        private service: ChargingTerminalService,
        private chargingVehicleService: ChargingVehicleService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute,
        private validator: ChargingTerminalValidator) {
    }

    ngOnInit() {
        this.chargingTerminal = this.context.getCopy('selected-chargingTerminal');
        this.initializeValidationRules();
        if (this.chargingTerminal == null) {
            this.gotoListing();
        }
        this.loadChargingVehicle();
    }

    loadChargingVehicle() {
        this.chargingVehicleService.getByOrganization(this.chargingTerminal.organizationId).subscribe(chargingVehicles => {
            this.chargingVehicles = chargingVehicles;
            for (let i = 0; i < chargingVehicles.length; i++) {
                if (this.chargingTerminal && chargingVehicles[i].id === this.chargingTerminal.chargingVehicleId) {
                    this.attachedChargingVehicle = chargingVehicles[i]; // TODO: Attach directly the object with select. 
                    break;
                }
            }

        });
    }

    gotoListing() {
        this.router.navigate(['/admin/charging-outlet/list']);
    }

    markChange($event: any) {
        this.changed = true;
    }

    close($event?: any) {
        this.descardconfirmationModal.hide();
        this.gotoListing();
    }

    save($event: any) {
        this.validator.validate(this.chargingTerminal).then(validationErrors => {
            this.validationErrors = validationErrors;
            if (validationErrors == null) {
                // NO ERROR
                this._save($event);
            }
        });
    }

    _save($event: any) {
        let service: Observable<any> = null;
        if (this.chargingTerminal.id == null) {
            service = this.create($event);
        } else {
            service = this.update($event);
        }
        service.subscribe(organization => {
            this.changed = false;
            this.close($event);
        });
    }

    create($event: any) {
        return this.service.create(this.chargingTerminal);
    }

    update($event: any) {
        return this.service.update(this.chargingTerminal);
    }

    checkAndClose($event: any) {
        if (this.changed) {
            this.descardconfirmationModal.show();
        } else {
            this.close($event);
        }
    }

    changeChargingVehicle($event: any) {
        this.attachedChargingVehicle = $event;
        this.chargingTerminal.chargingVehicleId = this.attachedChargingVehicle.id;
        this.markChange($event);
    }

    initializeValidationRules() {
        const validationSpecs = [
            { field: 'chargingVehicleId', mandatory: true, fieldLabel: 'Charging Vehicle of the Charging Terminal' },
            { field: 'make', mandatory: true, fieldLabel: 'Make of the Charging Terminal' },
            { field: 'price', mandatory: true, fieldLabel: 'Price of the Charging Terminal' },
            { field: 'model', mandatory: true, fieldLabel: 'Model of Charging Terminal' },
            { field: 'capacity', mandatory: true, fieldLabel: 'Capacity of Charging Terminal' },
            { field: 'equipment', mandatory: false, fieldLabel: 'Equipment of Charging Terminal' },
        ] as ValidationSpec[];
        this.validator.setValidationSpecs(validationSpecs);
        validationSpecs.forEach(validationSpec => {
            this.validationSpecs[validationSpec.field] = validationSpec;
        });
    }
}
