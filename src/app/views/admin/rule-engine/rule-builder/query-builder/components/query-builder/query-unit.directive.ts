import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({selector: '[queryUnit]'})
export class QueryUnitDirective {
  constructor(public template: TemplateRef<any>) {}
}
