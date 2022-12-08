import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './pagination.component';
import { PaginationService } from './index';
@NgModule({
    imports: [
      CommonModule,
      FormsModule,
    ],
    declarations: [PaginationComponent],
    exports: [
        PaginationComponent
    ],
    providers: [
        PaginationService
    ],
})
export class PaginationModule {

}
