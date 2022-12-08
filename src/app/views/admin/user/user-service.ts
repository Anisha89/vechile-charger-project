import { Injectable } from '@angular/core';
import { BaseService } from '../../../services/base.service';
import { Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { AppService } from '../../../app.service';
import { AppContext } from '../../../app.context';
import { HttpClient } from '@angular/common/http';
import { Api, ServerType } from '../../../services/Api';
import { environment } from '../../../../environments/environment';
import { CSVHelper } from '../../../services/csvhelper';

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseService {
    serverType:ServerType = ServerType.rcpaiServer;
    constructor(
        appContext: AppContext,
        http: HttpClient
    ) {
        super(appContext, http);
    }

    autoLogin(username: string) {
        return this._getNew(this.serverType, Api.userFetch.uri+`${username}`);
    }

    getAll(): Observable<any> {
        return this._getNew(this.serverType, Api.userFetchAll.uri);
    }

    create(user: User): Observable<any> {
        return this._postNew(this.serverType, Api.userCreate.uri, this.transformToUserDto(user));
    }

    update(user: User): Observable<any> {
        return this._putNew(this.serverType, Api.userUpdate.uri, this.transformToUserDto(user))
    }

    delete(username: string): Observable<any> {
        return this._deleteNew(this.serverType, Api.userDelete.uri + `${username}`);
    }

    get(username: string): Observable<any> {
        return this._getNew(this.serverType, Api.userFetch.uri+`${username}`);
    }

    getByOrganization(organizationId: string): Observable<any> {
        return this._get(`user?defaultOrganizationId=${organizationId}`);
    }

    getUserByUsername(username: string): Observable<any> {
        return this._getNew(this.serverType, Api.userFetch.uri+`${username}`);
    }
    
    getUsersBycompany(companyId: string): Observable<any> {
        return this._getNew(this.serverType, Api.getUsersBycompany.uri + `${companyId}`);
    }

    transformUser(userResponse: any) {
        let user = new User();
        let picture = userResponse.picture
        let imageType = picture?.substr(picture.indexOf("/")+1, picture.indexOf(environment.encoding) - 1 - picture.indexOf("/"))
        let imageData = picture?.substr(picture.indexOf(environment.encoding) + environment.encoding.length)
        let uints = new Uint8Array(imageData);
        // var base64 = btoa(String.fromCharCode(null, uints));
        var base64 = btoa(imageData);
        base64 = picture
        imageType = 'png'
        Object.assign(user, userResponse, {
          displayName: userResponse.lastName + ', ' + userResponse.firstName,
          userName: userResponse.login,
          emailAddress: userResponse.email,
          roleGroup: (userResponse.authorities && userResponse.authorities.length > 0) 
                            ? userResponse.authorities.reduce( (item1, item2)  =>  item1 + ', ' + item2) : '',
          picture: picture//picture == null ? picture : 'data:image/' + imageType +";base64," + imageData 
        })
        return user
      }

      transformToUserDto(user: User) {
        let usr = {}
        Object.assign(usr, user, {
          login: user.userName,
          authorities: [user.roleGroup]
        })
        console.log(usr);
        return usr
      }

      exportUsersToCSVFile(data, filename) {
        let fields = ['firstName','lastName','jobTitle','email','login','role','activated'];
        let titles = "S.No, First Name,Last Name,JobTitle,Email,Login,Role,Status\r\n";
        let csvData = titles + CSVHelper.convertToCSV(data, fields, titles);
        console.log(csvData);
        CSVHelper._exportToCSVFile(csvData, filename);
    }
}
