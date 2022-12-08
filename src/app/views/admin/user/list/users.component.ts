import { Component, OnInit, ViewChild } from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { User } from '../../../../models/user.model';
import { UserService } from '../user-service';
import { Organization } from '../../../../models';

@Component({
    selector: 'app-users',
    templateUrl: 'users.component.html',
    styleUrls: ['users.component.scss']
})
export class UsersComponent implements OnInit {
    @ViewChild('deleteConfirmationModal')
    public deleteConfirmationModal: ModalDirective;
    @ViewChild('statusChangeModal')
    public statusChangeModal: ModalDirective;
    currentOrganization: Organization;
    users: User[];
    selected: User;
  //  roleNames = "";
  //  roleMap: RoleMap;
    isLoading = false;
    constructor(private service: UserService,
    //    private roleService : RoleService,
        private context: AppContext,
        private router: Router) {

    }
   

    ngOnInit() {
        this.isLoading=true;
        this.currentOrganization = this.context.get('current-organization');
       // this.service.getAll().subscribe(usrsPage => {
        this.service.getUsersBycompany(this.currentOrganization.id).subscribe(usrsPage => {
            let usrLst = []
            for (let usr of usrsPage?.content) {
                usrLst.push(this.service.transformUser(usr));
            }
            this.users = usrLst;
            this.isLoading=false;
        }, error => {
            this.isLoading=false;
            // TODO display error
            console.log(error);

           // this.roleNames = this.selected.getRoleNames();
        });
    }

    
    select(user: User, $event?: any) {
        this.selected = user;
    }

    add($event: any) {
        // Initialize the default values here.
        const user: User = {
            defaultOrganizationId: this.currentOrganization.id,
            defaultOrganization: this.currentOrganization.name,
            companyId : this.currentOrganization.id,
            company : this.currentOrganization,
            language: 'English',
            roleGroup: "ROLE_USER",
            activated: 1,
            
        } as User;
        console.log(user);
        this.select(user, $event);
        this.context.set('selected-user', user);
         this.router.navigate(['/admin/user/add']);
    }

    delete(selectedUser: User) {
        this.deleteConfirmationModal.hide();
        this.service.delete(selectedUser.userName).subscribe(usrs => {
            this.users = this.users.filter(
                usr => {
                    return usr.userName !== selectedUser.userName
                });
        });
    }

    checkAndDelete(selected: User, $event: any) {
        this.select(selected, $event);
        this.deleteConfirmationModal.show();
    }

    edit(selected: User, $event?: any) {
        this.select(selected, $event);
        this.context.set('selected-user', selected);
        this.router.navigate(['/admin/user/edit']);
    }

    confirmAndChangeStatus(user: User, $event) {
        this.select(user, $event);
        this.alterStatus(user)
        this.statusChangeModal.show();
    }

    onStatusChange(user: User, $event: any) {
        this.service.update(user).subscribe(updateduser => {
            this.statusChangeModal.hide()
        });
    }

    cancelStatusChange(user: User) {
        this.alterStatus(user)
        this.statusChangeModal.hide();
    }

    alterStatus(user: User) {
        user.activated =0;
    }
     void(){

     }
    userCsvFile() {
        this.service.exportUsersToCSVFile(this.users, 'users.csv');
        
    };
    usersList=[];
    displayData(totalDatas) {
        this.usersList = totalDatas;
    }
}
