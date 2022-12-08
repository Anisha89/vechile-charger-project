import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AppContext } from '../../app.context';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { Api, getServerToken } from '../Api';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  private logged_in_user: User;

  constructor(
    private router: Router,
    private appContext: AppContext
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    let newHeader = req.headers; 
    Object.assign(newHeader, req.headers);

    newHeader = newHeader
                    .append('Content-Type', 'application/json')
                    .append('Accept', 'application/json');

   // const token = this.appContext.get(Api.loginUri.key);
   // const token = localStorage.getItem(Api.loginUri.key);
   const token = getServerToken(req.url); // we need to fix this properly

    if (!token) {
      // this.logged_in_user = JSON.parse(this.appContext.get('logged-in-user'));
      // const username = this.logged_in_user.userName
      // const password = this.logged_in_user.password

      // newHeader.append('Basic', btoa(username+':'+password))
      this.router.navigate(['/login'])
    } else {
      newHeader = newHeader.append('Authorization', 'Bearer ' + token)
    }
   
    const modifiedRequest = req.clone({ headers: newHeader })

    return next.handle(modifiedRequest).pipe(
      retry(1),
      map( res => {
        return res
      }),
      catchError(this.handleError)
    )
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
    // console.log(error);
    
    if(error.status != 401) {
      // window.alert(errorMessage);
    }

    return throwError(errorMessage);
}

  //TODO: Add code to perform on response actions.
  onResponse(response: HttpResponse<any>) {
    // console.log(response);
    return response.body
  }

}
