import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/base.service';
import { Organization } from '../../../models'
import { Observable } from 'rxjs';
import { AppContext } from '../../../app.context';
import { HttpClient } from '@angular/common/http';
import { Api, ServerType } from '../../../services/Api';
import { User } from '../../../models/user.model';

@Injectable()
export class OrganizationService extends BaseService {
    serverType :ServerType = ServerType.rcpaiServer; // this.serverType,
    constructor(
        appContext: AppContext,
        http: HttpClient
    ) {
        super(appContext, http);

        
    }

    create(organization: Organization): Observable<any> {
        let company = this.transformOrgDto(organization)
        let login = this.appContext.get('logged-in-user') as User
        company['createdBy'] = login.firstName
        company['createdOn'] = new Date()
        company['groupId'] = 'dummyId' 

        return this._postNew(this.serverType,Api.organizationCreate.uri, company);
    }

    update(organization: Organization): Observable<any> {
        console.log(this.transformOrgDto(organization));
        return this._putNew(this.serverType,Api.organizationUpdate.uri, this.transformOrgDto(organization));
    }

    delete(organizationId: string): Observable<any> {
        return this._deleteNew(this.serverType,Api.organizationDelete.uri + `${organizationId}`);
    }

    get(organizationId: string): Observable<any> {
        return this._getNew(this.serverType,Api.organizationFetch.uri + `${organizationId}`, this.transformOrg);
    }

    getAll(): Observable<any> {
        return this._getNew(this.serverType,Api.organizationFetchAll.uri);
    }

    transformOrg(orgResponse: any) {
        let org = new Organization();
        Object.assign(org, orgResponse, {
            address: orgResponse.formattedAddress,
            email: orgResponse.emailId,
            phone: orgResponse.phones,
            contact: {
                name: orgResponse.contactName,
                mobile: orgResponse.contactMobile,
                phone: orgResponse.contactPhone,
                email: orgResponse.contactEmail
            },
            service: {
                name: orgResponse.serviceName,
                replyToEmail: orgResponse.serviceReply,
                fromEmailName: orgResponse.serviceFrom,
                fromEmail: orgResponse.serviceFromEmail,
                disclaimerText: orgResponse.disclaimer

            }
        })
        return org
    }

    transformOrgDto(org: Organization) {
        let company = {}
        Object.assign(company, org, {
            formattedAddress: org.address,
            emailId: org.email,
            phones: org.phone,
            contactName: org.contact.name,
            contactMobile: org.contact.mobile,
            contactPhone: org.contact.phone,
            contactEmail: org.contact.email,
            serviceName: org.service.name,
            serviceReply: org.service.replyToEmail,
            serviceFrom: org.service.fromEmailName,
            serviceFromEmail: org.service.fromEmail,
            disclaimer: org.service.disclaimerText,
            status: org.status === 'ACTIVE' ? 1 : 0
        })
        return company
    }

}
