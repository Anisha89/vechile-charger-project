import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Domain } from '../models/domain.model';
import { AppContext } from '../app.context';
import { HttpClient } from '@angular/common/http';
import { Api, ServerType } from './Api';

@Injectable()
export class DomainService extends BaseService {
    serverType:ServerType = ServerType.rcpaiServer;
    constructor(
        appContext: AppContext,
        http: HttpClient
    ) {
        super(appContext, http);
    }

    getFacilityByOrganization(organizationId: string): Observable<any> {
        return this._getNew(this.serverType,Api.facilityFetchByCompany.uri + `${organizationId}`);
    }
    getFacilityById(facilityId: string): Observable<any> {
        return this._getNew(this.serverType,Api.facilityFetch + `${facilityId}`);
    }
    getAll(): Observable<any> {
        return this._getNew(this.serverType,Api.domainFetchAll.uri);
    }

    getAssetDomains(): Observable<any> {
        return this._getNew(this.serverType,Api.assetDomainList.uri);
    }

    create(domain: Domain): Observable<any> {
        return this._postNew(this.serverType,Api.domainCreate.uri, this.transformToDomainDto(domain));
    }

    update(domain: Domain): Observable<any> {
        return this._putNew(this.serverType,Api.domainUpdate.uri, this.transformToDomainDto(domain));
    }

    delete(domainId: string): Observable<any> {
        return this._deleteNew(this.serverType,Api.domainDelete.uri + `${domainId}`);
    }

    get(domainId: string): Observable<any> {
        return this._getNew(this.serverType,Api.domainFetch.uri + `${domainId}`);
    }

    getDomainRecord(entityName: string): Observable<any> {
        return this._getNew(this.serverType,Api.domainRecord.uri + `${entityName}`);
    }

    getDomainRecordList(entityName: string, entityType: string): Observable<any> {
        return this._postNew(this.serverType,Api.domainRecordList.uri + `${entityType}` + '/' + `${entityName}`, {});
    }

    getAssetsBycompany(companyId: string): Observable<any> {
        return this._getNew(this.serverType, Api.getAssetsBycompany.uri + `${companyId}`);
    }

    transformDomain(domResponse: any) {
        let fac = new Domain();
        Object.assign(fac, domResponse, {
            address: domResponse.formattedAddress,
            timeZone: domResponse.timezone,
            type: domResponse.facilityType,
            organizationId: domResponse.companyId,
            location: {
                latitude: domResponse.latitude,
                longitude: domResponse.longitude,
                default: false
            },
            status: domResponse.status === 1 ? 'ACTIVE' : 'INACTIVE'
        })
        return fac
    }

    transformToDomainDto(dom: Domain) {
        let domain = {}
        // Object.assign(facility, dom, {
        //     formattedAddress: dom.address,
        //     facilityType: dom.type,
        //     companyName: dom.organizationName,
        //     companyId: dom.organizationId,
        //     latitude: dom.location.latitude,
        //     longitude: dom.location.longitude,
        //     status: dom.status === 'ACTIVE' ? 1 : 0
        // })
        console.log(domain);
        return dom
    }

    static  staticTransformtoDomainDto(dom: Domain) {
        let domain = {}
        Object.assign(domain, dom, {
            entityName: dom.entityName,
            entityDescription: dom.entityDescription,
            owner: dom.owner,
            domainType:dom.domainType,
            schemaDefinition:dom.schemaDefinition,
            schemaDefinitionContentType:dom.schemaDefinitionContentType,
            rawFile:dom.rawFile,
            rawFileContentType:dom.rawFileContentType,
            isActive: dom.isActive
        })
        // Acomment*
        console.log(domain);
        return domain
    }

}
