import { Injectable } from '@angular/core';

@Injectable()
export class QueryBuilderContext {
    selected: any;

    setSelected(selected: any): void {
        this.selected = selected;
    }
}
