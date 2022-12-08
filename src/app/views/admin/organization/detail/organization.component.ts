import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { OrganizationService } from '../organization.service';
import { AppContext } from '../../../../app.context';
import { Organization } from '../../../../models';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { OrganizationValidator } from './organization.validator';
import { ValidationError, ValidationSpec } from '../../../../services/base.validator';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';

@Component({
    selector: 'app-organization',
    templateUrl: 'organization.component.html',
    styleUrls: ['organization.component.scss']
})
export class OrganizationComponent implements OnInit {

    organization: Organization = {
        address: ''
    } as Organization;
    changed: boolean;
    validationErrors: { [key: string]: ValidationError };
    validationSpecs: { [key: string]: ValidationSpec } = {};

    @ViewChild('discardConfirmationModal')
    public discardConfirmationModal: ModalDirective;

    public addressControl: FormControl = new FormControl();
    @ViewChild('addressRef')
    public addressElementRef: ElementRef;

    constructor(
        private service: OrganizationService,
        private validator: OrganizationValidator,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone) {

    }
    ngOnInit() {
        const organization = this.context.getCopy('selected-organization');
        if (organization == null) {
            this.gotoListing();
            return;
        }

        this.organization = organization;
        this.initializeValidationRules();
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
                    this.organization.address = place.formatted_address;
                    this.organization.location.latitude = place.geometry.location.lat();
                    this.organization.location.longitude = place.geometry.location.lng();
                    this.markChange(null);
                });
            });
        });
    }

    gotoListing() {
        this.router.navigate(['../list'], { relativeTo: this.route });
    }

    uploadLogo($event: any) {
        this.extractBase64Data($event).then(base64Data => {
            this.organization.logo = base64Data;
            this.markChange($event);
        });
    }

    uploadSmallLogo($event: any) {
        this.extractBase64Data($event).then(base64Data => {
            this.organization.smallLogo = base64Data;
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
        this.gotoListing();
    }

    save($event: any) {
        this.validator.validate(this.organization).then(validationErrors => {
            this.validationErrors = validationErrors;
            if (validationErrors == null) {
                // NO ERROR
                this._save($event);
                this.context.notify(null);
            }
        });
    }

    _save($event: any) {
        let service: Observable<any> = null;
        if (this.organization.id == null) {
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
        return this.service.create(this.organization);
    }

    update($event: any) {
        return this.service.update(this.organization);
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
            { field: 'name', mandatory: true, fieldLabel: 'Name of the Organization' },
            { field: 'address', mandatory: false, fieldLabel: 'Address of the Organization' },
            { field: 'email', mandatory: true, email: true, fieldLabel: 'Email Address of Organization' },
            { field: 'website', mandatory: true, fieldLabel: 'Website of Organization' },
            { field: 'logo', mandatory: false, fieldLabel: 'Logo of Organization' },
            { field: 'smallLogo', mandatory: false, fieldLabel: 'Small Logo' },
            { field: 'phone', mandatory: true, phoneNumber: true, fieldLabel: 'Phone of Organization' },
            { field: 'contact.name', mandatory: true, fieldLabel: 'Contact Detail Name' },
            { field: 'contact.phone', mandatory: true, phoneNumber: true, fieldLabel: 'Contact Detail phone' },
            { field: 'contact.mobile', mandatory: false, phoneNumber: true, fieldLabel: 'Contact Detail Mobile' },
            { field: 'contact.email', mandatory: true, email: true, fieldLabel: 'Contact Detail Email' },
            { field: 'service.name', mandatory: true, fieldLabel: 'Service Name' },
            { field: 'service.fromEmailName', mandatory: true, fieldLabel: 'Service From Name ' },
            { field: 'service.fromEmail', mandatory: true, email: true, fieldLabel: 'Service From Email' },
            { field: 'service.replyToEmail', mandatory: false, email: true, fieldLabel: 'Service Reply to email ' },
            { field: 'service.disclaimerText', mandatory: false, fieldLabel: 'Service  Desclaimer Text' },
        ] as ValidationSpec[];
        this.validator.setValidationSpecs(validationSpecs);
        validationSpecs.forEach(validationSpec => {
            this.validationSpecs[validationSpec.field] = validationSpec;
        })
    };
    statusChange(data, event) {
        console.log("event>>>>>", event);
        if (event) {
            this.organization.status = "ACTIVE";
        } else {
            this.organization.status = "INACTIVE";
        }
        console.log("data>>>>>", data);
    }

}
