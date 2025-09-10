import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, Role } from '../models/user';
import { EMAIL_ROLES, DOMAIN_ROLES, DEFAULT_ROLES } from '../config/roles.map';
import { EMAIL_COURSES } from '../config/roles.map'; // ⬅️ importar
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(this.restore());
  user$ = this._user$.asObservable();

  get user(): User | null { return this._user$.value; }
  get isLoggedIn(): boolean { return !!this.user; }
  get roles(): string[] { return this.user?.roles ?? []; }

  loginFromEmail(email: string, nombre?: string, token: string = '') {
    const lower = (email || '').toLowerCase();
    const byEmail = EMAIL_ROLES[lower];
    const domain = lower.split('@')[1] || '';
    const byDomain = DOMAIN_ROLES[domain];
    const roles = (byEmail || byDomain || DEFAULT_ROLES) as Role[];
  const allowedCourseIds = EMAIL_COURSES[lower] ?? [];

    const user: User = { id: lower, nombre: nombre || email, email: lower, roles, token,allowedCourseIds,};
    localStorage.setItem('user', JSON.stringify(user));
    this._user$.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this._user$.next(null);
  }

  hasRole(...required: Role[]): boolean {
    return required.some(r => this.roles.includes(r));
  }

  private restore(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  }

canAccessCourse(courseId: string): boolean {
  if (!this.user) return false;
  if (this.hasRole('BEDEL')) return true; // admin ve todo
  if (this.hasRole('PROFESOR')) {
    return (this.user.allowedCourseIds ?? []).includes(courseId);
  }
  return false;
}

getAllowedCourses(): string[] {
  if (this.hasRole('BEDEL')) return []; // semántica: vacío = todos
  return this.user?.allowedCourseIds ?? [];
}

}
