import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppContext } from './app.context';
import { User } from './models/user.model';
import { AppService } from './app.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private appService: AppService,
    private context: AppContext) { }

  ngOnInit() {
    this.ensureLoggedIn();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  ensureLoggedIn() {
    const userString = localStorage.getItem('logged-in-user');
    if (userString != null) {
      const user = JSON.parse(userString);
      this.context.set('logged-in-user', user);
      this.appService.loadDefaultOrganization(user.defaultOrganizationId).subscribe(organization => {
        this.context.set('current-organization', organization);
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
