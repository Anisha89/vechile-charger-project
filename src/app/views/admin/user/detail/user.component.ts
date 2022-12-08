import { Component, OnInit, ViewChild} from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ValidationError, ValidationSpec } from '../../../../services/base.validator';
import { User } from '../../../../models/user.model';
import { UserService } from '../user-service';
import { UserValidator } from './user.validator';
import { Organization } from '../../../../models';
import { OrganizationService } from '../../organization/organization.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { RoleService } from '../../role/role-service';
import { IdAndName, IdNameMap, RoleMap, Role, RolesMgr } from '../../../../models/role.model';

@Component({
    selector: 'app-user',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.scss']
})
export class UserComponent implements OnInit {
    roleMgr = new RolesMgr();
    roleMap: RoleMap;
    dropdownList = [];
    selectedItems = Array<IdAndName>();
    
    dropdownSettings:IDropdownSettings

    user: User = {} as User;
    changed: boolean;
    validationErrors: { [key: string]: ValidationError };
    validationSpecs: { [key: string]: ValidationSpec } = {};
    languages: string[] = ['English', 'Spanish' ];
    @ViewChild('discardConfirmationModal')
    public discardConfirmationModal: ModalDirective;
    @ViewChild('errorModal')
    public errorModal: ModalDirective;
    
    pwd: string
    roles: string[] = [];
    organizations: Organization[] = [];
    currentOrganization: Organization;
    constructor(
        private service: UserService,
        private roleService : RoleService,
        private validator: UserValidator,
        private organizationService: OrganizationService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }
    
    ngOnInit() {
           this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
          };
          const user = this.context.getCopy('selected-user');
        console.log(user);
        if (user == null) {
            this.gotoListing();
            return;
        }
        this.user = user;
        if (this.user.language === null) {
            this.user.language = this.languages[0];
        }
        this.initializeValidationRules();
        this.loadRoleService();
        this.loadUserRole();
        this.loadOrganizations();
    }

    loadRoleService() {
        this.currentOrganization = this.context.get('current-organization');
        this.roleService.getRolesByCompany(this.currentOrganization.id).subscribe(rolesPage => {
            let roleLst = []
            for (let role of rolesPage?.content) {
                roleLst.push(role);
            }
            let rMap = new RoleMap();
            rMap.init(roleLst);
            this.roleMap = rMap;
            this.roleMgr.init(roleLst);
            console.log(this.roleMap);
            this.dropdownList = this.roleMap.getAsList();
            this.selectedItems = this.roleMap.getMatchList(this.user.roles);
            console.log(this.selectedItems);
        }, error => {
            console.log(error);
        });
    }

    onItemSelect(item: any) {
        console.log(item);
      }
      onSelectAll(items: any) {
        console.log(items);
      }

    loadOrganizations() {
        this.organizationService.getAll().subscribe(organizationPage => {
            this.organizations = organizationPage?.content;
            console.log(this.organizations);
        });
    }
    
    changeDefaultOrganization(defaultOrganizationId: string) {
        this.user.companyId = defaultOrganizationId;
        this.user.company = this.organizations.find( org => org.id == defaultOrganizationId )
       
        this.markChange(defaultOrganizationId);
    }

    loadUserRole() {
        this.service.getAll().subscribe(userPage => {
            userPage?.content.forEach(element => {
                this.roles.push(element.roleGroup);
            });
        });
    }

    gotoListing() {
        this.router.navigate(['admin/user/list']);
    }

    uploadLogo($event: any) {
        this.extractBase64Data($event).then(base64Data => {
            this.user.picture = base64Data
            console.log(base64Data);
            this.markChange($event);
        });
    }

    uploadSmallLogo($event: any) {
        this.extractBase64Data($event).then(base64Data => {
            // this.user.picture = base64Data;
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

    getSelectedRoleIds() {
        var ids = new Array<String>();
        let selItems : IdAndName[] = this.selectedItems;
        if (selItems) {
                selItems.forEach(item => {
                ids.push(item.id);
            });
        }
        return ids;
    }

    getSelectedRoleIdsName() {
        var ids = new Array<String>();
        let selItems : IdAndName[] = this.selectedItems;
        if (selItems) {
                selItems.forEach(item => {
                ids.push(item.name);
            });
        }
        return ids;
    }

    save($event: any) {
        this.user.password = this.pwd != null ? this.pwd : this.user.password
        this.validator.validate(this.user).then(validationErrors => {
            this.validationErrors = validationErrors;
            console.log(this.validationErrors);
             if (validationErrors == null) {
             this._save($event);
            }
        });
    }

    _save($event: any) {
        let service: Observable<any> = null;
        this.user.lastModifiedBy = new Date()
        this.user.roles =  this.roleMgr.getRolesByName(this.getSelectedRoleIdsName());
        this.user.roleGroup = "ROLE_USER";
        this.insertCurrentOrgnanization();
        if (this.user.id == null) {
            service = this.create($event);
        } else {
            this.user.companyId = this.currentOrganization.id;
            service = this.update($event);
        }
        service.subscribe(organization => {
            this.changed = false;
            this.close($event);
        },
        error => {
            this.errorModal.show();
        },
        () => {
          // 'onCompleted' callback.
          // No errors, route to new page here
        });
    }

    insertCurrentOrgnanization() {
        for(let i = 0; i < this.user.roles.length; i++) {
            this.user.roles[i].company = this.currentOrganization;
            this.user.roles[i].companyId = this.currentOrganization.id;
        }
    }

    create($event: any) {
      console.log(this.user);
      return this.service.create(this.user);
    }

    update($event: any) {
        console.log(this.user)
        return this.service.update(this.user);
    }

    checkAndClose($event: any) {
        if (this.changed) {
            this.discardConfirmationModal.show();
        } else {
            this.close($event);
        }
    }

    changeLanguage($event: any){
        this.user.language = $event.target.value;
        this.markChange($event);
    }

    initializeValidationRules() {
        const validationSpecs = [
            { field: 'displayName', mandatory: false, fieldLabel: 'Display Name of the User' },
            { field: 'firstName', mandatory: true, fieldLabel: 'First Name of User' },
            { field: 'lastName', mandatory: true, fieldLabel: 'Last Name of User' },
            { field: 'userName', mandatory: true, fieldLabel: 'Username of User' },
            { field: 'password', mandatory: true, fieldLabel: 'Password of User' },
            { field: 'jobTitle', mandatory: false, fieldLabel: 'Job Title of User'},
            { field: 'email', mandatory: true, fieldLabel: 'Email of  User', email: true},
            { field: 'roleGroup', mandatory: false, fieldLabel: ' Role Group of User' },
            { field: 'mobile', mandatory: true, phoneNumber: true, fieldLabel: 'Phone number of  User'},
            { field: 'timeZone', mandatory: true, fieldLabel: 'Time Zone of  User' },
            { field: 'language', mandatory: true, fieldLabel: 'Language Name User' },
            { field: 'picture', mandatory: false,  fieldLabel: 'Picture of User' },
            { field: 'roles', mandatory: false,  fieldLabel: 'Roles of User' }, // dropdown validation.
            
        ] as ValidationSpec[];
        this.validator.setValidationSpecs(validationSpecs);
        validationSpecs.forEach(validationSpec => {
            this.validationSpecs[validationSpec.field] = validationSpec;
        })
    };
    statusChange(data, event) {
        console.log("event>>>>>", event);
        if (event) {
            this.user.activated = 1;
        } else {
            this.user.activated = 0;
        }
    }
}
