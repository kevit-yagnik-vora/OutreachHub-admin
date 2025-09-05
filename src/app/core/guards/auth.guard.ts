import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    // The guard subscribes to the isLoggedIn$ observable from our AuthService.
    return this.authService.isLoggedIn$.pipe(
      // We only need the current value, so we take the first emission and complete.
      take(1),

      // We map the boolean result.
      map((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          // If the user is logged in, allow them to proceed.
          return true;
        }

        // If the user is NOT logged in, create a UrlTree to redirect them
        // to the login page and block the current navigation.
        return this.router.createUrlTree(['/auth/login']);
      })
    );
  }
}
