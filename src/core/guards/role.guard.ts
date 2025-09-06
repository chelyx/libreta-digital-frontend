import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const required: string[] = route.data['roles'] ?? [];
    if (!this.auth.isLoggedIn) return this.router.parseUrl('/'); // o /login si tenés
    if (required.length === 0 || this.auth.hasRole(...(required as any))) return true;
    return this.router.parseUrl('/403');
  }
}
