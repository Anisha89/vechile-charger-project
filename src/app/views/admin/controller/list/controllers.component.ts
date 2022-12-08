import { Component, OnInit, ViewChild } from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { User } from '../../../../models/user.model';
import { Organization } from '../../../../models';
import { ControllerService } from '../controller-service';
import { Controller } from '../../../../models/controller.model';

@Component({
    selector: 'app-controllers',
    templateUrl: 'controllers.component.html',
    styleUrls: ['controllers.component.scss']
})
export class ControllersComponent implements OnInit {
    @ViewChild('deleteConfirmationModal')
    public deleteConfirmationModal: ModalDirective;
    @ViewChild('statusChangeModal')
    public statusChangeModal: ModalDirective;
    currentOrganization: Organization;
    controllers: Controller[];
    selected: Controller;
    constructor(private service: ControllerService,
        private context: AppContext,
        private router: Router) {

    }
    isLoading = false;
    isItData = false;
    ngOnInit() {
        this.isLoading = true;
        this.currentOrganization = this.context.get('current-organization');
        // this.service.getByOrganization(this.currentOrganization.id).subscribe(users => {
        this.service.getAll().subscribe(ctrlsPage => {
            let cntLst = []
            for (let cntrlr of ctrlsPage?.content) {
                cntLst.push(this.service.transformController(cntrlr));
            }
            console.log(cntLst);
            this.controllers = cntLst;
            if (this.controllers.length != 0) {
                this.isItData = true;
            }
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
            // TODO display error
            console.log(error);
        });
    }

    select(controller: Controller, $event?: any) {
        this.selected = controller;
    }

    add($event: any) {
        // Initialize the default values here.
        let controller: Controller={
            
            picture:'',
            
            serialNumber:'',
            version:'',
            description:'',
            ipAddress:'',
            macAddress:'',
            tags:'',
            status:1
        

        } as Controller
        this.select(controller, $event);
        this.context.set('selected-controller', controller);
        this.router.navigate(['/admin/controller/add']);
    }

    delete(selectedCont: Controller) {
        this.deleteConfirmationModal.hide();
        this.service.delete(selectedCont.id).subscribe(cntlrs => {
            this.controllers = this.controllers.filter(
                cont => {
                    return cont.id !== selectedCont.id
                });
        });
    }

    checkAndDelete(selected: Controller, $event: any) {
        this.select(selected, $event);
        this.deleteConfirmationModal.show();
    }

    edit(selected: Controller, $event?: any) {
        this.select(selected, $event);
        this.context.set('selected-controller', selected);
        this.router.navigate(['/admin/controller/edit']);
    }

    confirmAndChangeStatus(controller: Controller, $event) {
        this.select(controller, $event);
        this.alterStatus(controller)
        this.statusChangeModal.show();
    }

    onStatusChange(controller: Controller, $event: any) {
        this.modifyUpdatedByInfo(controller)
        this.service.update(controller).subscribe(updatedContrl => {
            this.statusChangeModal.hide()
        });
    }

    cancelStatusChange(contrl: Controller) {
        this.alterStatus(contrl)
        this.statusChangeModal.hide();
    }

    modifyUpdatedByInfo(controller: Controller) {
        let login = this.context.get('logged-in-user') as User
        controller.updatedBy = login.displayName
        controller.updatedOn = new Date()
    }

    alterStatus(controller: Controller) {
        controller.status = controller.status > 0 ? 0 : 1
    }

    void() {

    };
    controllersList = [];
    displayData(totalDatas) {
        this.controllersList = totalDatas;
    }
}
