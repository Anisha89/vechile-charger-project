import { Observable, throwError } from 'rxjs';
import { UUID } from 'angular2-uuid';
import { AppService } from '../app.service';
import { Api, getServer, ServerType } from '../services/Api'
import { AppContext } from '../app.context';
import { HttpClient, HttpErrorResponse, HttpRequest, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, catchError, retry } from 'rxjs/operators';

export class BaseService {

    constructor(
        public appContext: AppContext,
        private http: HttpClient
    ) {

    }

    ids = [
        'e3c53530-3585-11e9-b210-d663bd873d93',
        'e3c5368e-3585-11e9-b210-d663bd873d93',
        'e3c537c4-3585-11e9-b210-d663bd873d93',
        'e3c53b84-3585-11e9-b210-d663bd873d93',
        'e3c53ce2-3585-11e9-b210-d663bd873d93',
        'e3c53e18-3585-11e9-b210-d663bd873d93',
        'e3c53f44-3585-11e9-b210-d663bd873d93',
        'e3c54070-3585-11e9-b210-d663bd873d93',
        'e3c5419c-3585-11e9-b210-d663bd873d93',
        'e3c5453e-3585-11e9-b210-d663bd873d93',
        'e3c54692-3585-11e9-b210-d663bd873d93',
        'e3c547d2-3585-11e9-b210-d663bd873d93',
        'e3c54912-3585-11e9-b210-d663bd873d93',
        'e3c54a48-3585-11e9-b210-d663bd873d93',
        'e3c54b7e-3585-11e9-b210-d663bd873d93',
        'e3c54d0e-3585-11e9-b210-d663bd873d93',
        'e3c55088-3585-11e9-b210-d663bd873d93',
        'e3c551d2-3585-11e9-b210-d663bd873d93',
        'e3c5531c-3585-11e9-b210-d663bd873d93'
    ];

    _get(url: string): Observable<any> {
        const obserable = new Observable<any>(subscriber => {
            const idObj = this.parseUrl(url);
            const item = this.getItem(idObj);
            subscriber.next(item);
        });
        return obserable;
    }

    _post(url: string, data: any): Observable<any> {
        const obserable = new Observable<any>(subscriber => {
            const idObj = this.parseUrl(url);
            const item = this.setItem(idObj, data);
            subscriber.next(item);
        });
        return obserable;
    }

    _put(url: string, data: any): Observable<any> {
        return this._post(url, data);
    }

    _delete(url: string): Observable<any> {
        const obserable = new Observable<any>(subscriber => {
            const idObj = this.parseUrl(url);
            const items = this.deleteItem(idObj);
            subscriber.next(items);
        });
        return obserable;
    }

    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        // window.alert(errorMessage);
        return throwError(errorMessage);
    }

    _fetchToken(): String {
        return this.appContext.get('cpi-token')
    }

    _prepareHttpRequest(serverType : ServerType, method: string, url: string, body?: string): HttpRequest<any> {
        let hdrs: HttpHeaders = new HttpHeaders();
        hdrs.append("Accept", "application/json")
        hdrs.append("Content-Type", "application/json")
        //url = Api.scheme + '://' + Api.rcpaiBaseUrI + ':' + Api.rcpaiPort + url
        url = getServer(serverType) + url
        const httpReq = new HttpRequest(
            method
            , url
            , body
            , {
                headers: hdrs
            });

        //TODO: add if any http headers or http parameters to pass in each request.

        return httpReq
    }

    _sendRequest(request: HttpRequest<any>): Observable<any> {
        return this.http.post(request.url, request.body, { headers: request.headers }).
            pipe(
                map(
                    response => {
                        if (response instanceof HttpResponse) {
                            console.log("response of http request is ");
                            console.log(response);
                            return response.body
                        } else if (response instanceof HttpErrorResponse) {
                            console.log(response);
                        }
                        console.log(response);

                        // return response
                    }
                ),
                catchError(
                    this.handleError
                )
            )
    }

    _getNew(serverType : ServerType, url: string, funcGen?: any): Observable<any> {
        let req = this._prepareHttpRequest(serverType, 'GET', url)

        if (!funcGen)
            funcGen = val => { 
                return val
             }

        return this.http.get(
            req.url,
            {
                headers: req.headers
                , params: req.params
            }
        ).pipe(
            map(
                funcGen
            ),
            catchError(
                this.handleError
            )
        )
    }

    _postNew(serverType : ServerType, url: string, data: any, funcGen?: any): Observable<any> {
        return this._postNewCommon(serverType, url, 'POST', data, funcGen)
    }

    _putNew(serverType : ServerType, url: string, data: any, funcGen?: any): Observable<any> {
        return this._postNewCommon(serverType, url, 'PUT', data, funcGen);
    }

    _postNewCommon(serverType : ServerType, url: string, method: string, data: any, funcGen?: any): Observable<any> {

        if (!funcGen)
            funcGen = (val) => { return val; }

        let req = this._prepareHttpRequest(serverType, method, url, data)
        return ("POST" === method ? this.http.post(
            req.url,
            req.body,
            {
                headers: req.headers
                , params: req.params
            }
        ) : this.http.put(
            req.url,
            req.body,
            {
                headers: req.headers
                , params: req.params
            }
        )).pipe(
            map(
                funcGen
            ),
            catchError(
                this.handleError
            )
        )
    }
  
    _deleteNew(serverType : ServerType, url: string, funcGen?: any): Observable<any> {
        let req = this._prepareHttpRequest(serverType, 'DELETE', url)

        if (!funcGen)
            funcGen = val => { return val }

        return this.http.delete(
            req.url,
            {
                headers: req.headers
                , params: req.params
            }
        ).pipe(
            map(
                funcGen
            ),
            catchError(
                this.handleError
            )
        )
    }

    setItems(object: string, items: any[], override: boolean = true) {
        if (override) {
            localStorage.setItem(object, JSON.stringify(items));
        } else {
            if (localStorage.getItem(object) == null) {
                localStorage.setItem(object, JSON.stringify(items));
            }
        }
    }

    generateId(index?: number): string {
        if (index != null && index < this.ids.length) {
            return this.ids[index];
        } else {
            return UUID.UUID();
        }
    }

    private getItem(idObj: any): any {
        const itemsString = localStorage.getItem(idObj.object);
        if (itemsString) {
            const items = JSON.parse(itemsString);
            if (idObj.id) {
                let itemToReturn: any = null;
                items.forEach(item => {
                    if (item.id === idObj.id) {
                        itemToReturn = item;
                    }
                });
                return itemToReturn;
            } else if (idObj.params && idObj.params.length > 0) {
                const filteredItems = [];
                items.forEach(item => {
                    let matched = true;
                    idObj.params.forEach(param => {
                        if (item[param.key] !== param.value) {
                            matched = false;
                        }
                    });
                    if (matched) {
                        filteredItems.push(item);
                    }
                });
                return filteredItems;
            } else {
                return items;
            }
        }
        return null;
    }

    private setItem(idObj: any, item: any): any {
        if (item.id == null) {
            item.id = this.generateId();
        }
        let items = this.getItem(idObj);
        if (items == null) {
            items = [];
        }

        let index = -1;
        items.forEach((iitem, i) => {
            if (item.id === iitem.id) {
                index = i;
            }
        });
        if (index >= 0) {
            items[index] = item;
        } else {
            items.push(item);
        }
        this.setItems(idObj.object, items);
        return item;
    }

    private deleteItem(idObj: any) {
        let items = this.getItem({
            object: idObj.object
        });
        if (items == null) {
            items = [];
        }

        let index = -1;
        items.forEach((iitem, i) => {
            if (idObj.id === iitem.id) {
                index = i;
            }
        });

        if (index >= 0) {
            items.splice(index, 1);
        }
        this.setItems(idObj.object, items);
        return items;
    }

    private parseUrl(url: string): any {
        const urlAndParams = url.split('?');
        const urlParts = urlAndParams[0].split('/');
        const data = {
            object: urlParts[0]
        };
        if (urlParts.length > 1) {
            data['id'] = urlParts[1];
        }
        if (urlAndParams.length > 1 && urlAndParams[1].trim().length > 0) {
            const paramsPart = urlAndParams[1].split('&');
            const params = [];
            paramsPart.forEach(paramPart => {
                const keyValue = paramPart.split('=');
                if (keyValue.length === 2) {
                    params.push({
                        key: keyValue[0],
                        value: keyValue[1]
                    });
                }
            });
            data['params'] = params;
        }
        return data;
    }

}
