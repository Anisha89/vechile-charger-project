import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/base.service';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { AppContext } from '../../../app.context';
import { HttpClient } from '@angular/common/http';
import { Api, ServerType } from '../../../services/Api';
import { Controller } from '../../../models/controller.model';

@Injectable({
    providedIn: 'root'
})
export class ControllerService extends BaseService {
    serverType :ServerType = ServerType.rcpaiServer; // this.serverType,
    constructor(
        appContext: AppContext,
        http: HttpClient
    ) {
        super(appContext, http);
    }

    autoLogin(username: string) {
        return this._getNew(this.serverType,Api.controllerFetch.uri+`${username}`);
    }

    getAll(): Observable<any> {
        return this._getNew(this.serverType,Api.controllerFetchAll.uri);
    }

    create(controller: Controller): Observable<any> {
        return this._postNew(this.serverType,Api.controllerCreate.uri, this.transformToControllerDto(controller));
    }

    update(controller: Controller): Observable<any> {
        return this._putNew(this.serverType,Api.controllerUpdate.uri, this.transformToControllerDto(controller))
    }

    delete(username: string): Observable<any> {
        return this._deleteNew(this.serverType,Api.controllerDelete.uri + `${username}`);
    }

    get(username: string): Observable<any> {
        return this._getNew(this.serverType,Api.controllerCreate.uri+`${username}`);
    }

    getByOrganization(organizationId: string): Observable<any> {
        return this._get(`user?defaultOrganizationId=${organizationId}`);
    }

    getUserByUsername(username: string): Observable<any> {
        return this._getNew(this.serverType,Api.controllerCreate.uri+`${username}`);
    }

    transformController(controllerResp: any) {
        let controller = new Controller();
        // Object.assign(controller, userResponse, {
        //   displayName: userResponse.lastName + ', ' + userResponse.firstName,
        //   userName: userResponse.login,
        //   emailAddress: userResponse.email,
        //   roleGroup: (userResponse.authorities && userResponse.authorities.length > 0) 
        //                     ? userResponse.authorities.reduce( (item1, item2)  =>  item1 + ', ' + item2) : ''
        // })
        return controllerResp
      }

      transformToControllerDto(controller: Controller) {
        let cont = {}
        // Object.assign(cont, user, {
        //   login: user.userName,
        //   email: user.emailAddress,
        //   authorities: [user.roleGroup]
        // })
        return controller
      }
}
