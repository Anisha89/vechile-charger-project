/**
 * HTML Pipe for the internal html content
 */
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'safehtml'
})
export class SafeHtmlPipe implements PipeTransform {

    constructor(private _sanitizer: DomSanitizer) {
    }

    transform(v: string): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(v);
    }
}
