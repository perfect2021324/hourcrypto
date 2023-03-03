import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrentUser } from './currentuser';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private currentUser: CurrentUser) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.currentUser.getLocalStorageToken()
    if (!!token) {
      let AuthorizedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      return next.handle(AuthorizedReq)
    }
    return next.handle(req)
  }
}
