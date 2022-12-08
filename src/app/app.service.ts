import { Injectable } from '@angular/core';
import { BaseService } from './services/base.service';
import { User } from './models/user.model';
import { Organization } from './models';
import { Observable } from 'rxjs';
import { AppContext } from './app.context';
import { HttpClient } from '@angular/common/http';
import { Token } from './models/token.model';
import { Api, ServerType } from './services/Api';

@Injectable()
export class AppService extends BaseService {

    constructor(
        appContext: AppContext,
        http: HttpClient
    ) {
        super(appContext, http);
        // this.initializeUser();
        // this.initializeOranization();
    }

    autoLogin(userId: string): Observable<any> {
        return this._get(Api.userFetch.uri+`${userId}`);
    }

    loadDefaultOrganization(organizationId: string): Observable<any> {
        return this._getNew(ServerType.rcpaiServer,Api.organizationFetch.uri+`${organizationId}`);
    }

    getAllOrganizations(): Observable<any> {
        return this._getNew(ServerType.rcpaiServer, Api.organizationFetchAll.uri);
    }

    loginNew(serverType : ServerType, userName: string, password: string) {
        return this._postNew(serverType, Api.loginUri.uri, this.__prepareLoginRequest(userName, password), this.fetchToken);
    }
  
    fetchToken(response: any) {
        if(!response) 
            return ''
        else {
            localStorage.setItem('cip-token', response.id_token)
            return response.id_token
        }
    }

    __prepareLoginRequest(userName: string, password: string): Token {
        return {
            "username": userName,
            "password": password,
            "rememberMe": true
        }
    }

    login(userName: string, password: string) {
        return this._get(`user?userName=${userName}&password=${password}&status=ACTIVE`);
    }
}
