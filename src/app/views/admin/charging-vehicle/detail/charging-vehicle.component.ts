
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ValidationSpec, ValidationError } from '../../../../services/base.validator';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ChargingVehicle } from '../../../../models/charging-vehicle.model';
import { ChargingVehicleService } from '../charging-vehicle.service';
import { ChargingVehicleValidator } from './charging-vehicle.validator';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { ChargingTerminalService } from '../../charging-terminal/charging-terminal.service';
import { ChargingTerminal } from '../../../../models/charging-terminal.model';
import { Facility } from '../../../../models/facility.model';
import { FacilityService } from '../../facility/facility-service';
declare var google;

@Component({
    selector: 'app-charging-vehicle',
    templateUrl: 'charging-vehicle.component.html',
    styleUrls: ['charging-vehicle.component.scss']
})


export class ChargingVehicleComponent implements OnInit {
    chargingVehicle: ChargingVehicle = {
        address: ''
    } as ChargingVehicle;
    changed: boolean;
    validationErrors: { [key: string]: ValidationError };
    validationSpecs: { [key: string]: ValidationSpec } = {};
    assetTypes: string[] = ['Light EV Charging Vehicle', 'Mobile EV charger'];
    activateSerialNumber = true;
    chargingTerminals: ChargingTerminal[] = [];
    @ViewChild('descardconfirmationModal')
    public descardconfirmationModal: ModalDirective;
    facilities: Facility[];
    attachedFacility: Facility;

    public addressControl: FormControl = new FormControl();
    @ViewChild('addressRef')
    public addressElementRef: ElementRef;

    constructor(
        private service: ChargingVehicleService,
        private chargingTerminalService: ChargingTerminalService,
        private facilityService: FacilityService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute,
        private validator: ChargingVehicleValidator,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone) {

    }

    ngOnInit() {
        this.chargingVehicle = this.context.getCopy('selected-chargingVehicle');
        this.initializeValidationRules();
        if (this.chargingVehicle == null) {
            this.gotoListing();
        } else {
            if (this.chargingVehicle.id == null) {
                this.activateSerialNumber = false;
            }
        }
        this.loadFacilities();
        this.loadChargingTerminals();
        this.mapsAPILoader.load().then(() => {
            const originAutocomplete = new google.maps.places.Autocomplete(this.addressElementRef.nativeElement, {
            });
            originAutocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    // get the place result
                    const place: google.maps.places.PlaceResult = originAutocomplete.getPlace();

                    // verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    // set latitude, longitude
                    this.chargingVehicle.location.latitude = place.geometry.location.lat();
                    this.chargingVehicle.location.longitude = place.geometry.location.lng();
                    this.chargingVehicle.address = place.formatted_address;
                    this.markChange(null);
                });
            });
        });
    }

    loadFacilities() {
        this.facilityService.getByOrganization(this.chargingVehicle.organizationId).subscribe(facilities => {
            this.facilities = facilities;
            for (let i = 0; i < facilities.length; i++) {
                if (this.chargingVehicle && facilities[i].id === this.chargingVehicle.facilityId) {
                    this.attachedFacility = facilities[i]; // TODO: Map directy object to select
                    break;
                }
            }
        });
    }

    loadChargingTerminals() {
        if (this.chargingVehicle.id != null) {
            this.chargingTerminalService.getByChargingVehicleId(this.chargingVehicle.id).subscribe(chargingTerminals => {
                this.chargingTerminals = chargingTerminals;
            });
        }
    }

    changeFacility($event: any) {
        this.attachedFacility = $event;
        this.chargingVehicle.facilityId = this.attachedFacility.id;
        this.markChange($event);
    }

    gotoListing() {
        this.router.navigate(['admin/charging-vehicle/list']);
    }

    uploadLogo($event: any) {
        this.extractBase64Data($event).then(base64Data => {
            this.chargingVehicle.picture = base64Data;
            this.markChange($event);
        });
    }

    extractBase64Data($event: any): Promise<string> {
        const promise = new Promise<string>((resolve, reject) => {
            if ($event.target.files.length > 0) {
                const file: File = $event.target.files[0];
                const reader: FileReader = new FileReader();

                reader.onloadend = (e) => {
                    const base64Data = reader.result.toString();
                    resolve(base64Data);
                };
                reader.readAsDataURL(file);
            } else {
                resolve(null);
            }
        });
        return promise;
    }

    markChange($event: any) {
        this.changed = true;
    }

    close($event?: any) {
        this.descardconfirmationModal.hide();
        this.gotoListing();
    }

    save($event: any) {
        this.validator.validate(this.chargingVehicle).then(validationErrors => {
            this.validationErrors = validationErrors;
            if (validationErrors == null) {
                // NO ERROR
                this._save($event);
            }
        });
    }

    _save($event: any) {
        let service: Observable<any> = null;
        if (this.chargingVehicle.id == null) {
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
        return this.service.create(this.chargingVehicle);
    }

    update($event: any) {
        return this.service.update(this.chargingVehicle);
    }

    checkAndClose($event: any) {
        if (this.changed) {
            this.descardconfirmationModal.show();
        } else {
            this.close($event);
        }
    }

    initializeValidationRules() {
        const validationSpecs = [
            { field: 'assetSerialNumber', mandatory: true, fieldLabel: 'Asset Serial Number of the Charging Vehicle' },
            { field: 'facilityId', mandatory: true, fieldLabel: 'Facility of the Charging Vehicle' },
            { field: 'address', mandatory: true, fieldLabel: 'Address of the Charging Vehicle' },
            { field: 'make', mandatory: true, fieldLabel: 'Maker of the Charging Vehicle' },
            { field: 'model', mandatory: true, fieldLabel: 'Model of Charging Vehicle' },
            { field: 'totalCapacity', mandatory: true, fieldLabel: 'Total Capacity of Charging Vehicle' },
            { field: 'assetType', mandatory: true, fieldLabel: 'Asset Type of Charging Vehicle' }
        ] as ValidationSpec[];
        this.validator.setValidationSpecs(validationSpecs);
        validationSpecs.forEach(validationSpec => {
            this.validationSpecs[validationSpec.field] = validationSpec;
        });
    }

    changeAssetType($event: any) {
        this.chargingVehicle.assetType = $event.target.value;
        this.markChange($event);
    }
}
