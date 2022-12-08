import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/base.service';
import { Domain } from '../../../models/domain.model';
import { Observable } from 'rxjs';
import { AppContext } from '../../../app.context';
import { HttpClient } from '@angular/common/http';
import { Api, ServerType } from '../../../services/Api';
import { User } from '../../../models/user.model';
import { CSVHelper } from '../../../services/csvhelper';
import { RealtimeAsset } from '../../../models/realtimeasset.model';

@Injectable()
export class AssetDashboardServiceNew extends BaseService {
serverType :ServerType = ServerType.ciServer; // this.serverType,
    realtimedata:RealtimeAsset;
    constructor(
        appContext: AppContext,
        http: HttpClient
    ) {
        super(appContext, http);
    }
 
    getAssetListByCompnay(companyId: string): Observable<any> {
        return this._getNew(ServerType.rcpaiServer, Api.getAssetsBycompany.uri + `${companyId}`);
    }

    getRealtimeAssetListByCompany(companyId: string): Observable<any> {
        //return this._getNew(ServerType.ciServer, Api.getRealtimeAssetList.uri + `${companyId}`);
        return this._getNew(ServerType.ciServer, Api.getRealtimeAssetList.uri);
    }

    getRealTimeAssetById(assetId: string): Observable<any> {
        return this._getNew(ServerType.ciServer, Api.getRealtimeAsset.uri + `${assetId}`);
    }

    getRealTimeAlarmsByAssetId(assetId: string): Observable<any> {
        //return this._getNew(ServerType.ciServer, Api.getAlarmList.uri + `${assetId}`);
        return this._getNew(ServerType.ciServer, Api.getAlarmList.uri + `${assetId}`);
    }

    //Sample: { "assetId","38", "fromDate":"2021-07-01", "toDate":"2021-07-06" }
    postForRealTimeAlarmsByDateRange(controllerId : string, alarmsParams: any): Observable<any> {
        //return this._getNew(ServerType.ciServer, Api.getAlarmList.uri + `${assetId}`);
        return this._postNew(ServerType.ciServer, Api.getAlarmsbydate.uri + `${controllerId}`, alarmsParams);
    }
  
    assetChartReq(assetChart: string): Observable<any> {
        return this._postNew(ServerType.ciServer, Api.assetChart.uri, assetChart);
    }

    postForLatestRealTimeAsset(assetId: string, limitParams:any): Observable<any> {
        return this._postNew(ServerType.ciServer, Api.getRealtimeAsset.uri + `${assetId}`, limitParams);
    }

    getFacilityByOrganization(organizationId: string): Observable<any> {
        return this._getNew(this.serverType,Api.facilityFetchByCompany.uri + `${organizationId}`);
    }
   
}