import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentUser } from './currentuser';


/**
 * Should only be used on Login and Register page 
 * Will redirect to main/job/view if user already loggedIn
 */
@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {
  constructor(private router: Router, private currentUser: CurrentUser) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.debug({ predicate: !!this.currentUser.getLocalStorageToken(), token: this.currentUser.getLocalStorageToken() })
    if (!!this.currentUser.getLocalStorageToken()) {
      this.router.navigate(["main", "job", "view"])
      return false
    }
    return true
  }

}
