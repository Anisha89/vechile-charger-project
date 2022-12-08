import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Facility } from '../../../../models/facility.model';
import { FacilityService } from '../facility-service';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ValidationSpec, ValidationError } from '../../../../services/base.validator';
import { FacilityValidator } from './facility.validator';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ChargingVehicle } from '../../../../models/charging-vehicle.model';
import { ChargingVehicleService } from '../../charging-vehicle/charging-vehicle.service';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { User } from '../../../../models/user.model';
import { Organization } from '../../../../models';
declare var google;

@Component({
    selector: 'app-facility',
    templateUrl: 'facility.component.html',
    styleUrls: ['facility.component.scss']
})
export class FacilityComponent implements OnInit {
    facility: Facility = {
        address: ''
    } as Facility;
    chargingVehicles: ChargingVehicle[] = [];
    changed: boolean;
    validationErrors: { [key: string]: ValidationError };
    validationSpecs: { [key: string]: ValidationSpec } = {};
    facilityTypes: string[] = ['EV Charging Station', 'Heavy EV Charging Station'];

    @ViewChild('discardConfirmationModal')
    public discardConfirmationModal: ModalDirective;
    public addressControl: FormControl = new FormControl();
    @ViewChild('addressRef')
    public addressElementRef: ElementRef;
    currentOrganization: Organization;
      


   

    constructor(
        private service: FacilityService,
        private chargingVehicleService: ChargingVehicleService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute,
        private validator: FacilityValidator,
        private ngZone: NgZone,
        private mapsAPILoader: MapsAPILoader) {

    }

    ngOnInit() {
        this.facility = this.context.getCopy('selected-facility');

        this.currentOrganization = this.context.get('current-organization');

        this.initializeValidationRules();
        if (this.facility == null) {
            this.gotoListing();
        }

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
                    this.facility.location.latitude = place.geometry.location.lat();
                    this.facility.location.longitude = place.geometry.location.lng();
                    this.facility.address = place.formatted_address;
                    console.log(place);

                    this.markChange(null);
                });
            });
        });
        console.log(this.facility);
        if (this.facility.id != null) {
            this.loadChargingVehicles();
        }
    }

    loadChargingVehicles() {
        this.chargingVehicleService.getByFacility(this.facility.id).subscribe(chargingVehicles => {
            this.chargingVehicles = chargingVehicles;
        });
    }

    gotoListing() {
        this.router.navigate(['../list'], { relativeTo: this.route });
    }

    uploadLogo($event: any) {
        this.extractBase64Data($event).then(base64Data => {
            this.facility.picture = base64Data;
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

    selectedFacilityType(facilityType: string) {
        this.facility.type = facilityType;
    }


    markChange($event: any) {
        this.changed = true;
    }

    close($event?: any) {
        this.discardConfirmationModal.hide();
        this.gotoListing();
    }

    save($event: any) {

        
        this.facility.organizationId = this.currentOrganization.id
        this.facility.organizationName = this.currentOrganization.name
       this.facility.geoFrom=Facility.getplace(this.facility.geoFrom);
       this.facility.geoTo=Facility.getplace(this.facility.geoTo);
        this.validator.validate(this.facility).then(validationErrors => {
            this.validationErrors = validationErrors;
           
            if (validationErrors == null) {
                // NO ERROR
                this._save($event);
            }
        });
    }

    _save($event: any) {
        let service: Observable<any> = null;
        if (this.facility.id == null) {
            let login = this.context.get('logged-in-user') as User
            this.facility.createdBy = login.firstName
            this.facility.createdOn = new Date(),
     
         
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
        return this.service.create(this.facility);
    }

    update($event: any) {
        return this.service.update(this.facility);
    }

    checkAndClose($event: any) {
        if (this.changed) {
            this.discardConfirmationModal.show();
        } else {
            this.close($event);
        }
    }

    initializeValidationRules() {
        const validationSpecs = [
            { field: 'name', mandatory: true, fieldLabel: 'Name of the Facility' },
            { field: 'address', mandatory: true, fieldLabel: 'Address of the Facility' },
            { field: 'type', mandatory: true, fieldLabel: 'Type of Facility' },
            { field: 'timeZone', mandatory: false, fieldLabel: 'TimeZone of Facility' },
            { field: 'picture', mandatory: false, fieldLabel: 'Picture of Facility' },
        ] as ValidationSpec[];
        this.validator.setValidationSpecs(validationSpecs);
        validationSpecs.forEach(validationSpec => {
            this.validationSpecs[validationSpec.field] = validationSpec;
        });
    };
    statusChange(data, event) {
        console.log("event>>>>>", event);
        if (event) {
            this.facility.status = "ACTIVE";
        } else {
            this.facility.status = "INACTIVE";
        }
        console.log("data>>>>>", data);
    }

}
