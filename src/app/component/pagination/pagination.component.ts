import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PaginationService } from './index';
@Component({
  selector: 'app-pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: ['pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Output() valueChange = new EventEmitter();
  @Input() totalData = [];
  @Input() pageSize = 10;
  @Input() viewSize = 12; // 12 is default 
  constructor(private pagerService: PaginationService) { }
  pager: any = {};
  pagedItems: any[];
  totalPage: any=10;
  ngOnInit(): void {
    console.log(this.totalData);
    this.valueChanged(1)
  }
  changeTotalPage(event) {
    console.log(event);
    this.valueChanged(1)
  }
  valueChanged(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    console.log("this.totalPage>>",this.totalPage);
    console.log("this.page>>",page);
    this.pager = this.pagerService.getPager(this.totalData.length, page,this.pageSize);
    this.pagedItems = this.totalData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.valueChange.emit(this.pagedItems);
  }

}
