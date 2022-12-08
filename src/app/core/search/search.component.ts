import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SearchService } from './search.service';
// Observable class extensions
import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchService]
})
export class SearchComponent implements OnInit {
  private searchResult: Observable<string[]>;
  private autoSuggestion: any;
  private showInput: string = "";
  private dropDown: Boolean = false;
  private searchTermStream = new Subject<string>();
  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.searchResult = this.searchTermStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((term: string) => term ? this.searchService.search(term) : Observable.of([]));

    this.searchResult.subscribe(
      (data) => {
        this.autoSuggestion = {
          term: data[0],
          response: data[1],
          category: data[2]
        }
        if (this.autoSuggestion.response && this.autoSuggestion.response.length > 0) {
          this.dropDown = true;
        }
      }
    );
  }

  show() {
    if (this.showInput == "") {
      this.showInput = "visible";
    } else {
      this.showInput = "";
    }
  }

  search(term: string) {
    term ? this.searchTermStream.next(term) : this.dropDown = false;
  }

}
