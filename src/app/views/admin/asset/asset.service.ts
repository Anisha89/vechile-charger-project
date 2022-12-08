import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/base.service';
import { Domain } from '../../../models/domain.model';
import { Observable } from 'rxjs';
import { AppContext } from '../../../app.context';
import { HttpClient } from '@angular/common/http';
import { Api, ServerType } from '../../../services/Api';
import { User } from '../../../models/user.model';
import { CSVHelper } from '../../../services/csvhelper';
import { DomainService } from '../../../services/domain-service';

@Injectable()
export class AssetService extends BaseService {
   serverType:ServerType = ServerType.rcpaiServer;
    constructor(
        appContext: AppContext,
        http: HttpClient
    ) {
        super(appContext, http);
    }
     create(domain: Domain): Observable<any> {
        let asset = this.transformtoDomainDto(domain)
        let login = this.appContext.get('logged-in-user') as User
        asset['createdBy'] = login.firstName
        asset['createdOn'] = new Date()
        asset['groupId'] = 'dummyId'
        asset['owner'] = login.firstName; 
        
        return this._postNew(this.serverType, Api.domainCreate.uri, asset);
    }

    update(domain: Domain): Observable<any> {
        console.log(this.transformtoDomainDto(domain));
        return this._putNew(this.serverType, Api.domainUpdate.uri, this.transformtoDomainDto(domain));
    }

    delete(domainId: string): Observable<any> {
        return this._deleteNew(this.serverType, Api.domainDelete.uri + `${domainId}`);
    }

    get(domainId: string): Observable<any> {
        return this._getNew(this.serverType, Api.domainFetch.uri + `${domainId}`, this.transformDomain);
    }
   
    getAssetsBycompany(companyId: string): Observable<any> {
        return this._getNew(this.serverType, Api.getAssetsBycompany.uri + `${companyId}`);
    }

    getAll(): Observable<any> {
        return this._getNew(this.serverType, Api.domainFetchAll.uri);
    }
  

    transformDomain(domResponse: any) {
        let dom = new Domain();
        Object.assign(dom, domResponse, {
            entityName: domResponse.entityName,
            entityDescription: domResponse.entityDescription,
            owner: domResponse.owner,
            domainType:domResponse.domainType,
            isActive: domResponse.isActive,
             schemaDefinition:domResponse.schemaDefinition,
             schemaDefinitionContentType:domResponse.schemaDefinitionContentType,
             rawFile:domResponse.rawFile,
             rawFileContentType:domResponse.rawFileContentType
        
           
        })
        return dom
    }

    transformtoDomainDto(dom: Domain) {
       return DomainService.staticTransformtoDomainDto(dom)
    }

    exportAssetsToCSVFile(data, filename) {
        let fields = ['entityName','entityDescription', 'owner', 'domainType', 'isActive'];
        let titles = "S.No, Name, Description, Owner, DomainType, IsActive\r\n";
        let csvData = titles + CSVHelper.convertToCSV(data, fields, titles);
        console.log(csvData);
        CSVHelper._exportToCSVFile(csvData, filename);
    }

    
}