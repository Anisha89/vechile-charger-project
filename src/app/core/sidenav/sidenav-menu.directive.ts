import { Directive, HostBinding, Input } from '@angular/core';
@Directive({
  selector: '[appSidenavMenu]'
})
export class SidenavMenuDirective {
  @HostBinding('class.sidenav-opened') opened = false;
  // @HostBinding('class.sidenav-closed') closed:boolean = true;
  constructor() { }
  @Input() set appSidenavMenu(open: boolean) {
    this.opened = open;
  }

}
