import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/base.service';
import { Observable } from 'rxjs';
import { Role } from '../../../models/role.model';
import { AppService } from '../../../app.service';
import { AppContext } from '../../../app.context';
import { HttpClient } from '@angular/common/http';
import { Api, ServerType } from '../../../services/Api';
import { CSVHelper } from '../../../services/csvhelper';

@Injectable({
    providedIn: 'root'
})
export class RoleService extends BaseService {
    serverType :ServerType = ServerType.rcpaiServer; // this.serverType,
    constructor(
        appContext: AppContext,
        http: HttpClient
    ) {
        super(appContext, http);
    }

    autoLogin(username: string) {
        return this._getNew(this.serverType,Api.userFetch.uri+`${username}`);
    }

    getAll(): Observable<any> {
        return this._getNew(this.serverType,Api.roleFetchAll.uri);
    }

    getRolesByCompany(companyId: string): Observable<any> {
        return this._getNew(this.serverType,Api.rolesByCompany.uri + `${companyId}`);
    }

    getPermissions(): Observable<any> {
         return this._getNew(this.serverType,Api.rolePermissionList.uri);
    }
    create(user: Role): Observable<any> {
        return this._postNew(this.serverType,Api.roleCreate.uri, this.transformToRoleDto(user));
    }

    update(user: Role): Observable<any> {
        return this._putNew(this.serverType,Api.roleUpdate.uri, this.transformToRoleDto(user))
    }

    delete(username: string): Observable<any> {
        return this._deleteNew(this.serverType,Api.roleDelete.uri + `${username}`);
    }

    get(username: string): Observable<any> {
        return this._getNew(this.serverType,Api.roleFetch.uri+`${username}`);
    }

    getByOrganization(organizationId: string): Observable<any> {
        return this._get(`user?defaultOrganizationId=${organizationId}`);
    }

    getUserByUsername(username: string): Observable<any> {
        return this._getNew(this.serverType,Api.roleFetch.uri+`${username}`);
    }

    

    // transformRole(userResponse: any) {
    //     let role = new Role();
    //     Object.assign(role, userResponse, {
    //       displayName: userResponse.lastName + ', ' + userResponse.firstName,
    //       userName: userResponse.login,
    //       emailAddress: userResponse.email,
    //       roleGroup: (userResponse.authorities && userResponse.authorities.length > 0) 
    //                         ? userResponse.authorities.reduce( (item1, item2)  =>  item1 + ', ' + item2) : ''
    //     })
    //     return role
    //   }

      transformToRoleDto(role: Role) {
        // let usr = {}
        // Object.assign(usr, role, {
        //   login: role.userName,
        //   email: role.emailAddress,
        //   authorities: [user.roleGroup]
        // })
        // console.log(usr);
        // return usr

        return role
      }

      exportRolesToCSVFile(data, filename) {
        let fields = ['name','description', 'status'];
        let titles = "S.No, Name, Description,Status\r\n";
        let csvData = titles + CSVHelper.convertToCSV(data, fields, titles);
        console.log(csvData);
        CSVHelper._exportToCSVFile(csvData, filename);
    }
}
