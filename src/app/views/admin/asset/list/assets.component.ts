import { Component, OnInit, ViewChild } from '@angular/core';
import { AssetService } from '../asset.service';
import { AppContext } from '../../../../app.context';
import { Domain, IdAndNameList, IdAndName } from '../../../../models/domain.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { stringify } from '@angular/compiler/src/util';
import { Organization } from '../../../../models';

@Component({
    selector: 'app-assets',
    templateUrl: 'assets.component.html',
    styleUrls: ['assets.component.scss']
})
export class AssetsComponent implements OnInit {
    domains:Domain[];
    selected: Domain;
    currentOrganization: Organization;
    idAndNameList: IdAndNameList = new IdAndNameList();
    @ViewChild('deleteConfirmationModal')
    public deleteConfirmationModal: ModalDirective;
    @ViewChild('statusChangeModal')
    public statusChangeModal: ModalDirective;
    isLoading=false;
    constructor(
        private service: AssetService,
        private context: AppContext,
        private router: Router,
        private route: ActivatedRoute) {

    }
    
    
domainList = [];
    ngOnInit() {
        this.isLoading=true;
        this.currentOrganization = this.context.get('current-organization');
        this.service.getAssetsBycompany(this.currentOrganization.id).subscribe(domPage => {
        //this.service.getAll().subscribe(domPage => {
            let domLst = []
            for(let dom of domPage?.content) {
                domLst.push(this.service.transformtoDomainDto(dom))
            }
            this.domains = domLst;
            this.idAndNameList.initWithDomains(domLst);
            console.log(this.domains);
         
            this.isLoading=false;
        }, error => {
            this.isLoading=false;
            // TODO display error
            console.log(error);
        });
    }

    select(selected: Domain, $event?: any) {
        this.selected = selected;
    }

    add($event: any) {
        // Initialize the default values here.
        const domain:Domain = {
         defaultOrganizationId: this.currentOrganization.id,
         defaultOrganization: this.currentOrganization.name,
         company:this.currentOrganization,
         companyId:this.currentOrganization.id,
            entityName:'',
            entityDescription:'',
            owner:'',
            domainType:'ASSET',
            schemaDefinition:'',
            rawFile:'',
            isActive: true,
        } as Domain;
        
        let tIdNames = this.idAndNameList.getAll();

        this.select(domain, $event);
        this.context.set('selected-domain', domain);
        this.context.set('parent-domains', tIdNames);
        this.router.navigate(['admin/asset/add']);
    }

    edit(selected: Domain, $event?: any) {
        let tIdNames = this.idAndNameList.getAllExclue(selected.id);

        this.select(selected, $event);
        this.context.set('selected-domain', selected);
        this.context.set('parent-domains', tIdNames);
        this.router.navigate(['admin/asset/edit']);
    }
   
   

    confirmAnddelete(selected: Domain, $event?: any) {
        this.select(selected, $event);
        this.deleteConfirmationModal.show();
    }

    delete(selected: Domain, $event?: any) {
        this.deleteConfirmationModal.hide();
        this.service.delete(selected.id).subscribe(doms=> {
            this.domains = this.domains.filter(
                dom => {
                    return dom.id !== selected.id
                }
            );
            this.context.notify(null);
        });
    }

    confirmAndChangeStatus(domain:Domain, $event) {
        domain.isActive = !domain.isActive;
        this.select(domain, $event);
        this.statusChangeModal.show();
    }

    onStatusChange(domain: Domain, $event: any) {
        this.statusChangeModal.hide();
        this.service.update(domain).subscribe(updatedDomain => {

        });
    }

    cancelStatusChange(domain: Domain) {
        this.statusChangeModal.hide();
    }

    void() {
        
    };
    displayData(totalDatas) {
        this.domainList = totalDatas;
    }
    download(){
        this.service.exportAssetsToCSVFile(this.domains, 'assets.csv');
      }
}
