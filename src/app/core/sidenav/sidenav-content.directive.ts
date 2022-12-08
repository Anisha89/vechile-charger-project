import { Directive, Input, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appSidenavContent]'
})
export class SidenavContentDirective {
  @HostBinding('class.menu-opened') open : boolean = false;
  constructor() { }

  @Input() set appSidenavContent(opened: boolean){
    this.open = opened;
  }

  // @HostListener('click') onclick(e: KeyboardEvent){
  //   this.open = !this.open;
  // }
}
