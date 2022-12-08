import { Component, OnDestroy, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { getNavItems } from './../../_nav';
import { AppContext } from '../../app.context';
import { AppService } from '../../app.service';
import { Organization } from '../../models';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { DomainService } from '../../services/domain-service';
import { Domain } from '../../models/domain.model';
import { INavData } from '@coreui/angular';
import { of, Observable } from 'rxjs'
import { map } from 'rxjs/operators';
import { RoleService } from '../../views/admin/role/role-service';
import { resolveSanitizationFn } from '@angular/compiler/src/render3/view/template';
import { Role, RolesMgr } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { setShowAllPanel } from '../../_nav';
import { Api } from '../../services/Api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnDestroy {
  public navItems : Observable<INavData[]> //= of(navItems);
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  currentOrganization: Organization;
  private otherOrganizations: Organization[];
  loggedInUser: User;
  noOfKVAToBuy: number;
  isLoading = false;
  @ViewChild(TabsetComponent)
  tabSet: TabsetComponent;
  permissions:Permissions[];
  loggedInUserPermissions = Array<String>();

  constructor(
      public context: AppContext,
      private domservice: DomainService,
      private service: AppService,
      private roleService: RoleService,
      private router: Router,
      @Inject(DOCUMENT) _document?: any
  ) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
    //this.isLoading = false;
  }

  ngOnInit() {
    this.customizeNavigationPanel();
    console.log(' ngOnInit ' + this.router.url);
    const user = localStorage.getItem('logged-in-user');
    const token = localStorage.getItem(Api.loginUri.key);
    if (user != null) {
      this.loggedInUser = JSON.parse(user);
      this.context.set(Api.loginUri.key, token)
      if (this.loggedInUser.userName === "admin") {
        setShowAllPanel(true);
      } 
      let organization = localStorage.getItem('current-organization');
      this.currentOrganization = JSON.parse(organization);
      this.context.set('current-organization', this.currentOrganization);
      this.loadRoleService();
      this.loadOtherOrganization();
      this.context.registerForNotification().subscribe(() => {
        organization = localStorage.getItem('current-organization');
        this.currentOrganization = JSON.parse(organization);
        this.loadOtherOrganization();
      });
    } else {
      this.logout(null);
    }
  }

  // https://www.codegrepper.com/code-examples/javascript/angular+refresh+page+without+reloading
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.loadRoleService();
        this.router.navigate([currentUrl]);
    });
  }

  reloadRoot() {
    this.router.navigate(['/']);
  }
 
  switch(organization: Organization) {
    this.currentOrganization = organization;
    this.context.set('current-organization', this.currentOrganization);
    localStorage.setItem('current-organization', JSON.stringify(organization));
    const currentUrl = this.router.url;
    this.reloadCurrentRoute();
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  loadOtherOrganization() {
    this.otherOrganizations = [];
    this.service.getAllOrganizations().subscribe(organizationsPage => {

      organizationsPage?.content?.forEach(organization => {
      //  if (organization.id !== this.currentOrganization.id) {
          this.otherOrganizations.push(organization);
       // }
      });
    });
  }

  editProfile($event: any) {
    this.context.set('selected-user', this.loggedInUser);
    this.router.navigate(['/admin/user/edit']);
  }

  settings($event: any) {

  }

  alarms($event: any) {
    this.router.navigate(['/features/alarm/list']);
  }

  logout($event: any) {
    this.context.set('logged-in-user', null);
    // localStorage.removeItem('logged-in-user');
    // localStorage.removeItem('current-organization');
    localStorage.clear()
    this.context.clear()
    this.router.navigate(['/login']);
  }

  closeAsideMenu($event: any) {
    this.context.clearAsideContext();
  }

  setSelectedAsideOptionBuy($event) {
    this.tabSet.tabs[1].active = true;
  }

  customizeNavigationPanel() {
    this.isLoading = true;
    let domLst = [];
    const loggedInUserPermissions = this.loggedInUserPermissions;
    let navDomains : INavData[] = getNavItems(loggedInUserPermissions);
    this.domservice.getAll().subscribe( domainsPage => {
      for(let dom of domainsPage?.content) {
        domLst.push(dom)
      }
      console.log(domLst);
      
      let childMenuList = []
      domLst.forEach(
          dom => {
            let navDomain : INavData = {}
            navDomain.name = dom.entityName
            navDomain.url = '/features/analytics/domain'
            navDomain.icon = 'fa fa-pie-chart'
            navDomain.children = []
            
            dom.childDomains.forEach(chldDom => {
              let childMenu = this.convertDomainToNav(chldDom)
              navDomain.children.push(childMenu)
              childMenuList.push(childMenu)
            })

            if(navDomain.children.length > 0) {
            // if(navDomain.children.length == 0) {
              navDomain.children = null
              navDomain.url = navDomain.url + '/' + dom.id
            }
            if(dom.childDomains.length > 0) {
              navDomains.push(navDomain)
            }
          }
      )
      childMenuList?.forEach(
          childMenu => {
              let index = navDomains.map( chdMenu => { return chdMenu.name } ).indexOf(childMenu.name)
              if(index > -1) {
                navDomains.splice(index, 1)
              }
          }
      )
      this.navItems = of(navDomains)
      this.isLoading = false;
    })
  }

  convertDomainToNav(domain: Domain) :INavData {

    if(domain.childDomains.length == 0) {
      return {
        name: domain.entityName,
        url: '/features/analytics/domain/' + domain.id
      }
    } else {
      let childDomNav = []
      domain.childDomains.forEach(
        chldDom => {
          childDomNav.push(this.convertDomainToNav(chldDom))
        }
      )
      return {
        name: domain.entityName,
        url: '/features/analytics/domain',
        children: childDomNav
      }
    }
    
  }

  loadRoleService() {
    let companyId =  this.currentOrganization.id;
    if ((companyId === undefined || companyId === null) && 
        (this.loggedInUser.company != undefined &&  this.loggedInUser.company != null)) {
          companyId = this.loggedInUser.company.id;
    }

    if (companyId != undefined &&  companyId != null) {
      this.roleService.getRolesByCompany(companyId).subscribe(rolesPage => {
        let roleLst = Array<Role>();
        let loggedInUserPermissions = Array<String>();
        let permissions = Array<any>();
        for (let role of rolesPage?.content) {
          if (role.permissions != null && role.permissions.length > 0) {
            let pPermissionsArray = role.permissions;
            pPermissionsArray.forEach(pObject => {
              if (loggedInUserPermissions.indexOf(pObject.permissionName) <0) {
                loggedInUserPermissions.push(pObject.permissionName);
              }
            });
          }
        }
        this.loggedInUserPermissions = loggedInUserPermissions;
        this.customizeNavigationPanel();
    });
  }
  this.isLoading = false; // temp fix
  }
}
