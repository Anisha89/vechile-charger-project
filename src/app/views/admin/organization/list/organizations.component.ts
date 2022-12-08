import { Component, OnInit, ViewChild } from '@angular/core';
import { OrganizationService } from '../organization.service';
import { AppContext } from '../../../../app.context';
import { Organization } from '../../../../models';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-organizations',
    templateUrl: 'organizations.component.html',
    styleUrls: ['organizations.component.scss']
})
export class OrganizationsComponent implements OnInit {
    organizations: Organization[];
    selected: Organization;
    @ViewChild('deleteConfirmationModal')
    public deleteConfirmationModal: ModalDirective;
    @ViewChild('statusChangeModal')
    public statusChangeModal: ModalDirective;
    isLoading=false;
    constructor(
        private service: OrganizationService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }
orginationList = [];
    ngOnInit() {
        this.isLoading=true;
        this.service.getAll().subscribe(orgnsPage => {
            let orgsLst = []
            for(let org of orgnsPage?.content) {
                orgsLst.push(this.service.transformOrg(org))
            }
            this.organizations = orgsLst;
            console.log(this.organizations);
            this.isLoading=false;
        }, error => {
            this.isLoading=false;
            // TODO display error
            console.log(error);
        });
    }

    select(selected: Organization, $event?: any) {
        this.selected = selected;
    }

    add($event: any) {
        // Initialize the default values here.
        const organization: Organization = {
            location: {},
            contact: {},
            service: {},
            address: '',
            status: 'ACTIVE'
        } as Organization;
        this.select(organization, $event);
        this.context.set('selected-organization', organization);
        this.router.navigate(['admin/organization/add']);
    }

    edit(selected: Organization, $event?: any) {
        this.select(selected, $event);
        this.context.set('selected-organization', selected);
        this.router.navigate(['admin/organization/edit']);
    }

    confirmAnddelete(selected: Organization, $event?: any) {
        this.select(selected, $event);
        this.deleteConfirmationModal.show();
    }

    delete(selected: Organization, $event?: any) {
        this.deleteConfirmationModal.hide();
        this.service.delete(selected.id).subscribe(orgs => {
            this.organizations = this.organizations.filter(
                org => {
                    return org.id !== selected.id
                }
            );

            this.context.notify(null);

        });
    }

    confirmAndChangeStatus(organization: Organization, $event) {
        this.select(organization, $event);
        organization.status = organization.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
        this.statusChangeModal.show();
    }

    onStatusChange(organization: Organization, $event: any) {
        this.statusChangeModal.hide();
        this.service.update(organization).subscribe(updatedOrganization => {

        });
    }

    cancelStatusChange(organization: Organization) {
        this.statusChangeModal.hide();
        organization.status = organization.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    }

    void() {
        
    };
    displayData(totalDatas) {
        this.orginationList = totalDatas;
    }
}
