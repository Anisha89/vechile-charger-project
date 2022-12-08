import { Component, OnInit, ViewChild} from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ValidationError, ValidationSpec } from '../../../../services/base.validator';
import { ControllerValidator } from './controller.validator';
import { Organization } from '../../../../models';
import { OrganizationService } from '../../organization/organization.service';
import { ControllerService } from '../controller-service';
import { Controller } from '../../../../models/controller.model';
import { User } from '../../../../models/user.model';

@Component({
    selector: 'app-controller',
    templateUrl: 'controller.component.html',
    styleUrls: ['controller.component.scss']
})
export class ControllerComponent implements OnInit {

    controller: Controller = {} as Controller;
    changed: boolean;
    validationErrors: { [key: string]: ValidationError };
    validationSpecs: { [key: string]: ValidationSpec } = {};
    languages: string[] = ['English', 'Spanish' ];
    @ViewChild('discardConfirmationModal')
    public discardConfirmationModal: ModalDirective;

    controllers: string[] = [];
    organizations: Organization[] = [];

    constructor(
        private service: ControllerService,
        private validator: ControllerValidator,
        private organizationService: OrganizationService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {
    }
    
    ngOnInit() {
        const controller = this.context.getCopy('selected-controller');
        if (controller == null) {
            this.gotoListing();
            return;
        }
        this.controller = controller;
       
        this.initializeValidationRules();
        this.loadUserRole();
        this.loadOrganizations();
    }

    loadOrganizations() {
        this.organizationService.getAll().subscribe(organizationPage => {
            this.organizations = organizationPage?.content;
        });
    }

    changeDefaultOrganization(defaultOrganizationid: string) {
        this.controller.companyId = defaultOrganizationid;
        this.markChange(defaultOrganizationid);
    }

    loadUserRole() {
        this.service.getAll().subscribe(controllerPage => {
            controllerPage?.content.forEach(element => {
                this.controllers.push(element.roleGroup);
            });
        });
    }

    gotoListing() {
        this.router.navigate(['admin/controller/list']);
    }

    uploadLogo($event: any) {
        this.extractBase64Data($event).then(base64Data => {
            this.controller.picture = base64Data;
            this.markChange($event);
        });
    }

    // uploadSmallLogo($event: any) {
    //     this.extractBase64Data($event).then(base64Data => {
    //         this.controller.picture = base64Data;
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
                // reader.readAsBinaryString(file);
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
        console.log(this.controller)
        this.validator.validate(this.controller).then(validationErrors => {
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
        if (this.controller.id == null) {
            this.controller.createdBy = login.displayName
            this.controller.createdOn = new Date()
            this.modifyUpdatedByInfo(this.controller)
            this.controller.status = 1
            service = this.create($event);
        } else {
            this.modifyUpdatedByInfo(this.controller)
            service = this.update($event);
        }
        service.subscribe(organization => {
            this.changed = false;
            this.close($event);
        });
    }

    create($event: any) {
        return this.service.create(this.controller);
    }

    update($event: any) {
        return this.service.update(this.controller);
    }

    checkAndClose($event: any) {
        if (this.changed) {
            this.discardConfirmationModal.show();
        } else {
            this.close($event);
        }
    }


    modifyUpdatedByInfo(controller: Controller) {
        let login = this.context.get('logged-in-user') as User
        controller.updatedBy = login.displayName
        controller.updatedOn = new Date()
    }

    initializeValidationRules() {
        const validationSpecs = [
            { field: 'picture', mandatory: false, fieldLabel: 'Photo'},
            
            { field: 'serialNumber', mandatory: true, fieldLabel: 'Serial Number' },
            { field: 'version', mandatory:true, version:true,fieldLabel: 'Version of the Controller' },
            { field: 'description', mandatory: false, fieldLabel: 'Descriotion of the Controller' },
            { field: 'ipAddress', mandatory: true, ip:true ,fieldLabel: 'IP Address of the Controller' },
            { field: 'macAddress', mandatory: true,mac:true, fieldLabel: 'MAC Address of the Controller'},
            { field: 'tags', mandatory: false, fieldLabel: 'Tags'},
        ] as ValidationSpec[];
        this.validator.setValidationSpecs(validationSpecs);
        validationSpecs.forEach(validationSpec => {
            this.validationSpecs[validationSpec.field] = validationSpec;
        })
    };
    statusChange(data, event) {
        console.log("event>>>>>", event);
        if (event) {
            this.controller.status = 1;
        } else {
            this.controller.status = 0;
        }
        console.log("data>>>>>", data);
    }
}
