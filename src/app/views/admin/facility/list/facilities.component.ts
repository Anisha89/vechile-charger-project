import { Component, OnInit, ViewChild } from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Facility } from '../../../../models/facility.model';
import { FacilityService } from '../facility-service';
import { Organization } from '../../../../models';

@Component({
    selector: 'app-facilities',
    templateUrl: 'facilities.component.html',
    styleUrls: ['facilities.component.scss']
})
export class FacilitiesComponent implements OnInit {
    @ViewChild('deleteConfirmationModal')
    public deleteConfirmationModal: ModalDirective;
    @ViewChild('statusChangeModal')
    public statusChangeModal: ModalDirective;
   
    facilities: Facility[];
    selected: Facility;
    //13.067439, 80.237617.==chennai
    //12.972442, 77.580643.==bangalore
    currentOrganization: Organization;
    constructor(private service: FacilityService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }
    isLoading=false;
    ngOnInit() {
        this.isLoading=true;
        this.currentOrganization = this.context.get('current-organization');
        this.service.getByOrganization(this.currentOrganization.name).subscribe(facicilityPage => {
            let facilityList = []
            for (let facility of facicilityPage?.content) {
                facilityList.push(this.service.transformFacility(facility))
            };
            this.facilities = facilityList;
            console.log(this.facilities);
            this.isLoading=false;
        }, error => {
            this.isLoading=false;
            // TODO display error
            console.log(error);
        });
    }

    select(selected: Facility, $event?: any) {
        this.selected = selected;
    }

    add($event: any) {
        // Initialize the default values here.
        const facility: Facility = {
            organizationId: this.currentOrganization.id,
            organizationName: this.currentOrganization.name,
            location: {},
            address: '',
            status: 'ACTIVE'
        } as Facility;
        this.select(facility, $event);
        this.context.set('selected-facility', facility);
        this.router.navigate(['/admin/facility/add'], { relativeTo: this.route });
    }

    delete(selectedFacility: Facility) {
        this.deleteConfirmationModal.hide();
        this.service.delete(selectedFacility.id).subscribe(facLst => {
            this.facilities = this.facilities.filter(fac => {
                return fac.id != selectedFacility.id
            }
            );
        });
    }

    checkAndDelete(selected: Facility, $event: any) {
        this.select(selected, $event);
        this.deleteConfirmationModal.show();
    }

    edit(selected: Facility, $event?: any) {
        this.select(selected, $event);
        this.context.set('selected-facility', selected);
        this.router.navigate(['/admin/facility/edit'], { relativeTo: this.route });
    }

    confirmAndChangeStatus(facility: Facility, $event) {
        this.select(facility, $event);
        facility.status = facility.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
        this.statusChangeModal.show();
    }

    onStatusChange(facility: Facility, $event: any) {
        this.statusChangeModal.hide();
        this.service.update(facility).subscribe(updatedFacility => {

        });
    }

    cancelStatusChange(facility: Facility) {
        this.statusChangeModal.hide();
        facility.status = facility.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    }

    close() {

    }

    void() {

    }
    facilityisList=[];
    displayData(totalDatas) {
        this.facilityisList = totalDatas;
    }
}
