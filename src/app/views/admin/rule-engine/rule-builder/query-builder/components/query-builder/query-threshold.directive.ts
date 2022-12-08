import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({selector: '[queryThreshold]'})
export class QueryThresholdDirective {
  constructor(public template: TemplateRef<any>) {}
}
