import { Component, OnInit, ViewChild} from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ValidationError, ValidationSpec } from '../../../../services/base.validator';
import { Role } from '../../../../models/role.model';
import { RoleService } from '../role-service';
import { RoleValidator } from './role.validator';
import { Organization } from '../../../../models';
import { OrganizationService } from '../../organization/organization.service';
import { User } from '../../../../models/user.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Permission } from '../../../../models/permission.model';
import { TimeSliderComponent } from '../../rule-engine/time-slider/time-slider.component';



@Component({
    selector: 'app-role',
    templateUrl: 'role.component.html',
    styleUrls: ['role.component.scss']
})
export class RoleComponent implements OnInit {
    allPermissions: Permission[];

    company:Organization[];
    selectedPermissions:Permission[];
    dropdownSettings:IDropdownSettings;
     role: Role = {} as Role;
    changed: boolean;

    validationErrors: { [key: string]: ValidationError };
    validationSpecs: { [key: string]: ValidationSpec } = {};
    languages: string[] = ['English', 'Spanish' ];
    @ViewChild('discardConfirmationModal')
    public discardConfirmationModal: ModalDirective;
    public errorModal: ModalDirective;

    roles: string[] = [];
    organizations: Organization[] = [];
    details:[];
    currentOrganization: Organization;
  
    constructor(
        private service: RoleService,
        private validator: RoleValidator,
        private organizationService: OrganizationService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }
    
    ngOnInit() {
        this.dropdownSettings={
            singleSelection:false,
            idField:'id',
            textField:'permissionName',
            selectAllText:'SelectAll',
            unSelectAllText:'UnSelectAll',
            itemsShowLimit:5,
            allowSearchFilter:true
        } 
        this.loadUserRole();
        this.loadOrganizations();
       
        const allPermissions = this.context.getCopy('all-permissions');
        this.currentOrganization = this.context.get('current-organization');
        this.allPermissions = allPermissions;
     
        const role = this.context.getCopy('selected-role');
        
        
        console.log(role);
        
          if (role == null) {
              this.gotoListing();
              return;
          }
          this.role = role;
          this.role.company = this.currentOrganization;
          this.selectedPermissions = role.permissions;
          this.initializeValidationRules();
    }
    
    onItemSelect(item:any){
       console.log('onItemSelct',item)
    }
   
    onSelectAll(items:any){
        console.log('onSelectAll',items)
    }
    
    loadOrganizations() {
        this.organizationService.getAll().subscribe(organizations => {
            this.organizations = organizations;
        });
    }

    changeDefaultOrganization(companyId: string) {
        this.role.companyId = companyId;
        this.markChange(companyId);
    }

  
    loadUserRole() {
        this.service.getAll().subscribe(roles => {
            roles.forEach(element => {
                this.roles.push(element.roleGroup);
            });
        });
    }

    gotoListing() {
        this.router.navigate(['admin/role/list']);
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
        this.validator.validate(this.role).then(validationErrors => {
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
        if (this.role.id == null) {
            this.role.createdBy = login.displayName
            this.role.createdOn = new Date()
            this.modifyUpdatedByInfo(this.role)
            this.role.status = 1
            this.role.permissions = this.getTheMatchingPermissions();//this.selectedPermissions;
            service = this.create($event);
        } else {
            this.role.permissions = this.getTheMatchingPermissions();//this.selectedPermissions;
            this.modifyUpdatedByInfo(this.role)
            service = this.update($event);
        }
        service.subscribe(role => {
            this.changed = false;
            this.close($event);
        }        ,
        error => {
            this.errorModal.show();
        },
        () => {
          // 'onCompleted' callback.
          // No errors, route to new page here
        });
    }

    create($event: any) {
        return this.service.create(this.role);
    }

    update($event: any) {
        return this.service.update(this.role);
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

    initializeValidationRules() {
        const validationSpecs = [
            { field: 'name', mandatory: true, fieldLabel: 'Name of the Role' },
            { field: 'desciption', mandatory: false, fieldLabel: 'Description of the Role' },
          
            { field: 'tags', mandatory: false, fieldLabel: 'Tags' },
            { field: 'permissions', mandatory: false, fieldLabel: 'Permissions' },

  
        ] as ValidationSpec[];
        this.validator.setValidationSpecs(validationSpecs);
        validationSpecs.forEach(validationSpec => {
            this.validationSpecs[validationSpec.field] = validationSpec;
        })
    }

    modifyUpdatedByInfo(role: Role) {
        let login = this.context.get('logged-in-user') as User
        role.updatedBy = login.displayName
        role.updatedOn = new Date()
    };
    statusChange(data, event) {
        console.log("event>>>>>", event);
        if (event) {
            this.role.status = 1;
        } else {
            this.role.status = 0;
        }
        console.log("data>>>>>", data);
    }

    getTheMatchingPermissions() {
        let selItems = this.selectedPermissions;
        let allItems = this.allPermissions;
        let selPermissions = new Array<Permission>();
        if (selItems != null){

        }
        selItems.forEach(sItem => {
            allItems.forEach(aItem => {
                if (sItem.id === aItem.id) {
                    selPermissions.push(aItem);
                }
            })
        })
        return selPermissions;
    }
}