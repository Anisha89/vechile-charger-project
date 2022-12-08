import {Component, Input} from "@angular/core";
import {DataTable, SortEvent} from "angular2-datatable";

@Component({
  selector: 'app-table-sorter',
  templateUrl: './table-sorter.component.html',
  styleUrls: ['./table-sorter.component.scss']
})
export class TableSorterComponent {

  @Input("by") sortBy: string;
  isSortedByMeAsc: boolean = false;
  isSortedByMeDesc: boolean = false;

  public constructor(private mfTable: DataTable) {
  }

  public ngOnInit(): void {
    this.mfTable.onSortChange.subscribe((event: SortEvent) => {
      this.isSortedByMeAsc = (event.sortBy == this.sortBy && event.sortOrder == "asc");
      this.isSortedByMeDesc = (event.sortBy == this.sortBy && event.sortOrder == "desc");
    });
  }

  sort() {
    if (this.isSortedByMeAsc) {
      this.mfTable.setSort(this.sortBy, "desc");
    } else {
      this.mfTable.setSort(this.sortBy, "asc");
    }
  }

}
