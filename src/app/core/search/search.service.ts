import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class SearchService {

  constructor(private http: Http) { }
  search(term: string): Observable<any[]> {
    return this.http
      .get(`/search/complete?method=completion&mkt=44571&r=0XJHSZTG4CD0PPB9ZQYV&s=261-7624405-0560036&c=A1V6SS4C7DJC7O&p=Gateway&l=en_IN&sv=desktop&client=amazon-search-ui&search-alias=aps&q=${term}&qs=&cf=1&fb=1&sc=1&`)
      .map(response =>{
        return response.json() as any[]
      });
  }

}
