import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class CanReadGuard implements CanActivate {
    isAuth = false;
    isAdmin = false;

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {

        return this.authService.user$.pipe(
            take(1),
            map(user => user && this.authService.canRead(user) ? true : false),
            tap(isAdmin => {
                if (!isAdmin) {
                    console.log('Access denied - Must have permission to view content');
                }
            })
        );
    }
}
