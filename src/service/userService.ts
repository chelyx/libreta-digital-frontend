import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {

  // Guardamos roles como BehaviorSubject para que otros componentes puedan suscribirse
  private rolesSubject = new BehaviorSubject<string[]>([]);
  roles$ = this.rolesSubject.asObservable();

  constructor() {}

  // Método de utilidad para verificar si tiene un rol específico
  hasRole(role: string): boolean {
    //console.log('Current roles:', this.rolesSubject.getValue());

    return this.rolesSubject.getValue().includes(role);
  }

  setRoles(roles: string[]): void {
    this.rolesSubject.next(roles);
  }

  isStudent(): boolean {
    return this.hasRole('ALUMNO');
  }

  isProfessor(): boolean {
    return this.hasRole('PROFESOR');
  }
}
