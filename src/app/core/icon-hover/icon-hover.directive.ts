import { Directive, Host, HostListener, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appIconHover]'
})
export class IconHoverDirective {

  private image: { normal: string, hover: string };

  @HostBinding('attr.xlink:href') source: string;

  @Input() set appIconHover(data: { normal: string, hover: string }) {
    this.image = data;
    this.setSource(this.image.normal);
  };


  @HostListener('mouseenter') onMouseEnter() {
    this.setSource(this.image.hover);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setSource(this.image.normal);
  }


  private setSource(value: string) {
    this.source = value;
  }

}
