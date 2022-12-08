import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/base.service';
import { Observable } from 'rxjs';
import { AppService } from '../../../app.service';
import { AppContext } from '../../../app.context';
import { HttpClient } from '@angular/common/http';
import { Api, ServerType } from '../../../services/Api';
import { Department } from '../../../models/department.model';

@Injectable({
    providedIn: 'root'
})
export class DepartmentService extends BaseService {
    serverType :ServerType = ServerType.rcpaiServer;
    constructor(
        appContext: AppContext,
        http: HttpClient
    ) {
        super(appContext, http);
    }

    getAll(): Observable<any> {
        return this._getNew(this.serverType,Api.departmentFetchAll.uri);
    }

    create(user: Department): Observable<any> {
        return this._postNew(this.serverType,Api.departmentCreate.uri, this.transformToDeptDto(user));
    }

    update(user: Department): Observable<any> {
        return this._putNew(this.serverType,Api.departmentUpdate.uri, this.transformToDeptDto(user))
    }

    delete(username: string): Observable<any> {
        return this._deleteNew(this.serverType,Api.departmentDelete.uri + `${username}`);
    }

    get(username: string): Observable<any> {
        return this._getNew(this.serverType,Api.departmentFetch.uri+`${username}`);
    }

    getByOrganization(organizationId: string): Observable<any> {
        return this._get(`user?defaultOrganizationId=${organizationId}`);
    }

    getUserByUsername(username: string): Observable<any> {
        return this._getNew(this.serverType,Api.userFetch.uri+`${username}`);
    }

    transformDept(departmentResponse: any) {
        // let department = new Department();
        // Object.assign(department, departmentResponse, {
        //   displayName: departmentResponse.lastName + ', ' + departmentResponse.firstName,
        //   userName: departmentResponse.login,
        //   emailAddress: departmentResponse.email,
        //   roleGroup: (departmentResponse.authorities && departmentResponse.authorities.length > 0) 
        //                     ? departmentResponse.authorities.reduce( (item1, item2)  =>  item1 + ', ' + item2) : ''
        // })
        // return department
        return departmentResponse
      }

      transformToDeptDto(department: Department) {
        // let dpt = {}
        // Object.assign(dpt, department, {
        //   login: department.userName,
        //   email: department.emailAddress,
        //   authorities: [department.roleGroup]
        // })
        // console.log(dpt);
        // return dpt
        return department
      }
}
