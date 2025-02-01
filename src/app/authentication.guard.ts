import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from './services/user.service';
import {IUser, UserType} from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  private currentUser: IUser | null

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.currentUser = null;
    this.userService.user$.subscribe((res) => {this.currentUser = res})
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (state.url == "/authorization") {
      return true;
    }
    if (typeof window === 'undefined') {
      return false;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      return this.router.parseUrl('/authorization');
    }

    if (state.url == "/admin") {
      return this.currentUser?.userType === UserType.ADMIN
    }

    return true;
  }

}
