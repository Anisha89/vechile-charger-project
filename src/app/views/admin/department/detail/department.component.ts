import { Component, OnInit, ViewChild} from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ValidationError, ValidationSpec } from '../../../../services/base.validator';
import { DepartmentService } from '../department-service';
import { DepartmentValidator } from './department.validator';
import { Organization } from '../../../../models';
import { OrganizationService } from '../../organization/organization.service';
import { Department } from '../../../../models/department.model';
import { User } from '../../../../models/user.model';
import { FacilityService } from '../../facility/facility-service';
import { Facility } from '../../../../models/facility.model';

@Component({
    selector: 'app-department',
    templateUrl: 'department.component.html',
    styleUrls: ['department.component.scss']
})
export class DepartmentComponent implements OnInit {

    department: Department = {} as Department;
    changed: boolean;
    validationErrors: { [key: string]: ValidationError };
    validationSpecs: { [key: string]: ValidationSpec } = {};
    languages: string[] = ['English', 'Spanish' ];
    @ViewChild('discardConfirmationModal')
    public discardConfirmationModal: ModalDirective;

    roles: string[] = [];
    organizations: Organization[] = [];
    facilities: Facility[] = [];

    constructor(
        private service: DepartmentService,
        private validator: DepartmentValidator,
        private organizationService: OrganizationService,
        private facilityService: FacilityService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }
    
    ngOnInit() {
        const department = this.context.getCopy('selected-department');
        console.log(department);
        
        if (department == null) {
            this.gotoListing();
            return;
        }
        this.department = department;
        this.initializeValidationRules();
        this.loadUserRole();
        this.loadOrganizations();
        this.loadFacilities()
    }

    loadOrganizations() {
        this.organizationService.getAll().subscribe(organizationPage => {
            this.organizations = organizationPage?.content;
            
    
        });
    }

    changeDefaultOrganization(defaultOrganizationId: string) {
        this.department.companyId = defaultOrganizationId;
        this.markChange(defaultOrganizationId);
    }

    loadFacilities() {
        this.facilityService.getAll().subscribe(facilityPage => {
            this.facilities = facilityPage?.content;

        });
    }

    changeDefaultFacility(facilityId: string) {
        this.department.facilityId = facilityId;

        this.markChange(facilityId);
    }

    loadUserRole() {
        this.service.getAll().subscribe(userPage => {
            userPage?.content?.forEach(element => {
                this.roles.push(element.roleGroup);
            });
        });
    }

    gotoListing() {
        this.router.navigate(['admin/department/list']);
    }

    // uploadLogo($event: any) {
    //     this.extractBase64Data($event).then(base64Data => {
    //         this.user.picture = base64Data;
    //         this.markChange($event);
    //     });
    // }

    // uploadSmallLogo($event: any) {
    //     this.extractBase64Data($event).then(base64Data => {
    //         this.user.picture = base64Data;
    //         this.markChange($event);
    //     });
    // }

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
        this.validator.validate(this.department).then(validationErrors => {
            this.validationErrors = validationErrors;
            if (validationErrors == null) {
                // NO ERROR
                this._save($event);
            }
        });
    }

    _save($event: any) {
        let service: Observable<any> = null;
        let login = this.context.get('logged-in-user') as User
        if (this.department.id == null) {
            this.department.createdBy = login.displayName
            this.department.createdOn = new Date()
            this.modifyUpdatedByInfo(this.department)
            this.department.status = 1
            service = this.create($event);
        } else {
            this.modifyUpdatedByInfo(this.department)
            service = this.update($event);
        }
        service.subscribe(organization => {
            this.changed = false;
            this.close($event);
        });
    }

    create($event: any) {
        return this.service.create(this.department);
    }

    update($event: any) {
        return this.service.update(this.department);
    }

    checkAndClose($event: any) {
        if (this.changed) {
            this.discardConfirmationModal.show();
        } else {
            this.close($event);
        }
    }

    // changeLanguage($event: any){
    //     this.user.language = $event.target.value;
    //     this.markChange($event);
    // }

    modifyUpdatedByInfo(department: Department) {
        let login = this.context.get('logged-in-user') as User
        department.updatedBy = login.displayName
        department.updatedOn = new Date()
    }

    initializeValidationRules() {
        const validationSpecs = [
            { field: 'name', mandatory: true, fieldLabel: 'Name of the Department' },
            { field: 'facilityId', mandatory: true, fieldLabel: 'Name of the Facility' },
            { field: 'companyId', mandatory: true, fieldLabel: 'Name of the Company/Organization' },
            { field: 'emailId', mandatory: true, fieldLabel: 'Email of the Department' },
            { field: 'phones', mandatory: true, fieldLabel: 'Phone Number of the Department' },
            { field: 'contactName', mandatory: true, fieldLabel: 'Name of the Contact'},
            { field: 'contactPhone', mandatory: true, fieldLabel: 'Phone Number of the Contact'},
            { field: 'contactMobile', mandatory: true, fieldLabel: 'Mobile Number of the Contact'},
            { field: 'contactEmail', mandatory: true, fieldLabel: 'Emailaddress of the Contact', email: true},
            { field: 'tags', mandatory: false, fieldLabel: 'Tags of the Contact'}
        ] as ValidationSpec[];
        this.validator.setValidationSpecs(validationSpecs);
        validationSpecs.forEach(validationSpec => {
            this.validationSpecs[validationSpec.field] = validationSpec;
        })
    };

    statusChange(data, event) {
        console.log("event>>>>>", event);
        if (event) {
            this.department.status = 1;
        } else {
            this.department.status = 0;
        }
        console.log("data>>>>>", data);
    }
}
