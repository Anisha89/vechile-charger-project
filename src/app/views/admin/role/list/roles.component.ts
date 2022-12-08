import { Component, OnInit, ViewChild } from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Role } from '../../../../models/role.model';
import { RoleService } from '../role-service';
import { Organization } from '../../../../models';
import { User } from '../../../../models/user.model';
import { Permission } from '../../../../models/permission.model';


@Component({
    selector: 'app-roles',
    templateUrl: 'roles.component.html',
    styleUrls: ['roles.component.scss']
})
export class RolesComponent implements OnInit {
    @ViewChild('deleteConfirmationModal')
    public deleteConfirmationModal: ModalDirective;
    @ViewChild('statusChangeModal')
    public statusChangeModal: ModalDirective;
    currentOrganization: Organization;
    roles: Role[];
    isLoading = false;
    selected: Role;
    allPermissions:Permissions[];
    constructor(private service: RoleService,
        private context: AppContext,
        private router: Router) {

    }

    ngOnInit() {
        this.isLoading = true;
        this.currentOrganization = this.context.get('current-organization');
        this.loadPermissions();
     
        //this.service.getAll().subscribe(rolesPage => {
        this.service.getRolesByCompany(this.currentOrganization.id).subscribe(rolesPage => {
            let roleLst = []
            for (let role of rolesPage?.content) {
                roleLst.push(role);
            }
            console.log(roleLst);
            this.roles = roleLst
            this.isLoading = false;
        }, error => {
            // TODO display error
            this.isLoading = false;
            console.log(error);
        });

    }

    loadPermissions(){
        this.service.getPermissions().subscribe(response=>{
            this.allPermissions=response.content;
        })
      }
  
    select(role, $event?: any) {
        this.selected= role;
    }

    add($event: any) {
        // Initialize the default values here.
     const role: Role = {
       companyId: this.currentOrganization.id,
       company:this.currentOrganization, //not needed
       companyName:this.currentOrganization.name,
       permissions:{},
           status: 1
        } as Role;
        this.select(role, $event);
        this.context.set('selected-role', role);
        this.context.set('all-permissions', this.allPermissions);
        this.router.navigate(['/admin/role/add']);
    }


   
    delete(selectedrole: Role) {
        this.deleteConfirmationModal.hide();
        this.service.delete(selectedrole.id).subscribe(roles => {
            this.roles = this.roles.filter(
                rle => {
                    return rle.id !== selectedrole.id
                });
        });
    }

    checkAndDelete(selected: Role, $event: any) {
        this.select(selected, $event);
        this.deleteConfirmationModal.show();
    }

    edit(selected: Role, $event?: any) {
     //   const perm = this.permissions;
        if (selected.company === null) {
            selected:this.currentOrganization;//not needed
        }
        this.select(selected, $event);
        this.context.set('selected-role', selected);
        this.context.set('all-permissions', this.allPermissions);
        this.router.navigate(['/admin/role/edit']);
    }

    confirmAndChangeStatus(role: Role, $event) {
        this.select(role, $event);
        this.alterStatus(role)
        this.statusChangeModal.show();
    }

    onStatusChange(role: Role, $event: any) {
        this.modifyUpdatedByInfo(role)
        this.service.update(role).subscribe(updatedrole => {
            // console.log(updatedrole);
            this.statusChangeModal.hide();            
        });
    }

    cancelStatusChange(role: Role) {
        this.alterStatus(role)
        this.statusChangeModal.hide();
        // role.status = role.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    }

    modifyUpdatedByInfo(role: Role) {
        let login = this.context.get('logged-in-user') as User
        role.updatedBy = login.displayName
        role.updatedOn = new Date()
    }

    alterStatus(role: Role) {
        role.status = role.status > 0 ? 0 : 1
    }

    void() {

    };
    rolesList=[];
    displayData(totalDatas) {
        this.rolesList = totalDatas;
    }
    rolesCsvFile() {
        this.service.exportRolesToCSVFile(this.roles, 'roles.csv');
    };
}
