import { Component, OnInit } from '@angular/core';
import { AppContext } from '../../../../app.context';
import { Domain } from '../../../../models/domain.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainService } from '../../../../services/domain-service';

@Component({
    selector: 'app-asset-dashboard',
    templateUrl: './asset-dashboard.component.html',
    styleUrls: ['./asset-dashboard.component.scss']
})
export class AssetDashboardComponent implements OnInit {
    selectedDomain: Domain;
    isLoading: boolean = !false;
    assetTypeMap: Map<Number, String> = new Map();
    assetMap: Map<Number, String> = new Map();
    assetType: string;
    asset: string;
    showAssetDropDown: boolean = false;
    showAssetImage: boolean = false;
    childDomainData = ['alert', 'history', 'realtime']
    // domainDataMap: Map<String, String>[] = [];
    domainDataMap: any[] = [];
    domainHistoryDataMap: any = {};
    domainHistoryDataKeys: string[]

    constructor(private context: AppContext,
        private router: Router,
        private route: ActivatedRoute,
        private domainService: DomainService) {
        route.params.subscribe(
            param => {
                // this.loadChildDomainsData(param?.domainId)
            }
        )
    }

    ngOnInit() {
        this.loadAssetType()
    }

    loadAssetType() {
        this.isLoading = true
        this.domainService.getAssetDomains().subscribe(
            assetDomainPage => {
                assetDomainPage?.content?.forEach(assetType => {
                    this.assetTypeMap.set(assetType.id, assetType.entityName)
                });
                this.isLoading = false
            }
        )
    }

    loadChildDomainsData(domainId: string) {
        this.childDomainData.forEach(
            childExt => {
                this.isLoading = true
                this.domainService.getDomainRecordList(this.selectedDomain?.entityName + '_' + childExt + '/true', this.selectedDomain?.domainType).subscribe(
                    responseRecordList => {
                        if (childExt === "history") {
                            this.domainHistoryDataMap = {
                                name: this.selectedDomain?.entityName + '_' + childExt,
                                data: responseRecordList
                            }
                            if (!this.domainHistoryDataKeys && responseRecordList.length > 0) {
                                this.domainHistoryDataKeys = Object.keys(responseRecordList[0])
                            }
                        } else {
                            this.domainDataMap.push({
                                name: this.selectedDomain?.entityName + '_' + childExt,
                                data: responseRecordList
                            })
                        }
                        this.isLoading = false
                    }
                )
                console.log(this.domainHistoryDataMap)
            }
        )
    }

    loadDomainByAsset(domainId: string) {
        let assetColumnName = "honda_col2"
        let assetColumnId = "honda_col3"
        console.log('loading domain by id' + domainId);
        this.isLoading = true
        this.domainService.get(domainId).subscribe(
            (domain: Domain) => {
                this.selectedDomain = domain
                this.domainService.getDomainRecordList(domain.entityName + '/false', domain.domainType).subscribe(
                    (responseRecordList: any[]) => {
                        //Showing the data on left column of the page under the image
                        // this.domainDataMap.push({
                        //     name: domain.entityName,
                        //     data: responseRecordList
                        // })

                        responseRecordList.forEach(
                            it => {
                                this.assetMap.set(it[assetColumnId], it[assetColumnName])
                            }
                        )
                        this.isLoading = false
                    }
                )
                this.showAssetDropDown = true;
            }
        )
    }

    onAssetTypeChanged(assetType: string) {
        console.log(assetType);
        if (this.assetType) {
            this.loadDomainByAsset(assetType)
        } else {
            this.showAssetDropDown = false;
            this.showAssetImage = false;
        }
    }

    onAssetChanged(asset: string) {
        console.log(asset);
        if (this.asset) {
            this.showAssetImage = true;
            this.loadChildDomainsData(this.asset)
        } else {
            this.showAssetImage = false;
        }
    }
}
