import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { AppContext } from '../../app.context';
import { User } from '../../models/user.model';
import { Api, ServerType } from '../../services/Api'
import { UserService } from '../admin/user/user-service';
import { setShowAllPanel } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent {
  userName: string = '';
  password: string = '';
  hasError = false;
  isLoading = false;
  loginError =false;
  constructor(
    private appService: AppService,
    private userService: UserService,
    private context: AppContext,
    private router: Router
  ) {
// this.login()
  }

  login() {
    setShowAllPanel(false);
    this.isLoading = true;
    this.appService.loginNew(ServerType.rcpaiServer, this.userName, this.password).subscribe(token => {
      console.log(token);
      let user: User
      this.context.set(Api.loginUri.key, token)
      if (token != null) {
        this.isLoading = true;
        localStorage.setItem(Api.loginUri.key, token)
        this.userService.getUserByUsername(this.userName).subscribe(
          userResponse => {
            user = this.userService.transformUser(userResponse)
            user.defaultOrganizationId = '2' //'e3c5368e-3585-11e9-b210-d663bd873d93'
            this.isLoading = false;
            if (user !== null) {
              if (user.userName === "admin") {
                setShowAllPanel(true);
              }
              localStorage.setItem('logged-in-user', JSON.stringify(user));
              this.context.set('logged-in-user', user);
              this.isLoading = true;
              this.appService.loadDefaultOrganization(user.defaultOrganizationId).subscribe(organization => {
                this.context.set('current-organization', organization);
                this.isLoading = false;
                localStorage.setItem('current-organization', JSON.stringify(organization));
                this.isLoading = true;
                this.appService.loginNew(ServerType.ciServer, this.userName, this.password).subscribe(token => {
                  console.log('loginToCIServer ' + token);
                  this.context.set(Api.loginCIServer.key, token)
                  if (token != null) {
                    this.isLoading = true;
                    localStorage.setItem(Api.loginCIServer.key, token)
                  }
                  this.isLoading = false;
                  this.router.navigate(['/']);
                  this.context.notify(user);
                }, err => {
                  this.loginError = true;
                  setTimeout(() => {
                    this.loginError = false;
                  }, 100);
                  this.isLoading = false;
                },
                  () => {
                    this.isLoading = false;
                  });
              });
            } else {
              this.hasError = true;
              this.isLoading = false;
            }
          }, err => {
            console.log(err);

            this.isLoading = false;
          },
          () => {
            this.isLoading = false;
          },
        )
      }
      this.isLoading = false;
    }, err => {
      this.loginError = true;
      setTimeout(() => {
        this.loginError = false;
      }, 3000);
      this.isLoading = false;
    },
      () => {
        this.isLoading = false;
      });
  }

  loginToCIServer_NotUsed() {
    const user = localStorage.getItem('logged-in-user');
    this.isLoading = true;
    this.appService.loginNew(ServerType.ciServer, this.userName, this.password).subscribe(token => {
      console.log('loginToCIServer ' + token);
      this.context.set(Api.loginCIServer.key, token)
      if (token != null) {
        this.isLoading = true;
        localStorage.setItem(Api.loginCIServer.key, token)
      }
      this.isLoading = false;
    }, err => {
      this.loginError = true;
      setTimeout(() => {
        this.loginError = false;
      }, 3000);
      this.isLoading = false;
    },
      () => {
        this.isLoading = false;
      });
  }
}
