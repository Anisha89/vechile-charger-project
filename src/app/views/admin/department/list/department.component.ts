import { Component, OnInit, ViewChild } from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DepartmentService } from '../department-service';
import { Organization } from '../../../../models';
import { Department } from '../../../../models/department.model';
import { User } from '../../../../models/user.model';

@Component({
    selector: 'app-departments',
    templateUrl: 'department.component.html',
    styleUrls: ['department.component.scss']
})
export class DepartmentsComponent implements OnInit {
    @ViewChild('deleteConfirmationModal')
    public deleteConfirmationModal: ModalDirective;
    @ViewChild('statusChangeModal')
    public statusChangeModal: ModalDirective;
    currentOrganization: Organization;
    departments: Department[];
    selected: Department;
    constructor(private service: DepartmentService,
        private context: AppContext,
        private router: Router) {

    }
    isLoading=false;
    ngOnInit() {
        this.isLoading=true;
        this.currentOrganization = this.context.get('current-organization');
        // this.service.getByOrganization(this.currentOrganization.id).subscribe(users => {
        this.service.getAll().subscribe(deptsPage => {
            let deptLst = []
            for (let dept of deptsPage?.content) {
                deptLst.push(this.service.transformDept(dept));
            }
            this.departments = deptLst
            this.isLoading=false;
        }, error => {
            this.isLoading=false;
            // TODO display error
            console.log(error);
        });
    }

    select(department: Department, $event?: any) {
        this.selected = department;
    }

    add($event: any) {
        // Initialize the default values here.
        let department: Department
          = {
           
            name:'',
            facilityId:'',
            companyId:'',
            emailId:'',
            phones:'',
            contactName:'',
            contactPhone:'',
            contactMobile:'',
            contactEmail:'',
            tags:'',
            status:1
            
            
         } as Department;
        this.select(department, $event);
        this.context.set('selected-department', department);
        this.router.navigate(['/admin/department/add']);
    }

    delete(selectedDept: Department) {
        this.deleteConfirmationModal.hide();
        this.service.delete(selectedDept.id).subscribe(depts => {
            this.departments = this.departments.filter(
                dept => {
                    return dept.id !== selectedDept.id
                });
        });
    }

    checkAndDelete(selected: Department, $event: any) {
        this.select(selected, $event);
        this.deleteConfirmationModal.show();
    }

    edit(selected: Department, $event?: any) {
        this.select(selected, $event);
        this.context.set('selected-department', selected);
        this.router.navigate(['/admin/department/edit']);
    }

    confirmAndChangeStatus(department: Department, $event) {
        this.select(department, $event);
        this.alterStatus(department)
        this.statusChangeModal.show();
    }

    onStatusChange(department: Department, $event: any) {
        this.modifyUpdatedByInfo(department)
        this.service.update(department).subscribe(updatedDept => {
            this.statusChangeModal.hide()
        });
    }

    cancelStatusChange(department: Department) {
        this.alterStatus(department)
        this.statusChangeModal.hide();
    }

    modifyUpdatedByInfo(department: Department) {
        let login = this.context.get('logged-in-user') as User
        department.updatedBy = login.displayName
        department.updatedOn = new Date()
    }

    alterStatus(department: Department) {
        department.status = department.status > 0 ? 0 : 1
    }

    void() {

    };
    departmentsList = [];
    displayData(totalDatas) {
        this.departmentsList = totalDatas;
    }
}
