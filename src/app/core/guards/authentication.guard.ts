import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {map} from "rxjs/operators";
import {AuthService} from "@core/services/api/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return of(!!this.authService.token)
      .pipe(map(allowed => {
        console.log('authguard', allowed);
        if (!allowed) {
          this.router.navigate(['/auth/master']);
          return false;
        } else {
          return true;
        }
      }));
  }

}
