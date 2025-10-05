import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export enum PANELES {
  CODE_GENERATOR = 'code-generator',
  CODE_VALIDATOR = 'code-validator',
  MATERIAS = 'materias',
  ASISTENCIA = 'asistencia',
  CALIFICACIONES = 'calificaciones'
}

export enum ROLES {
  PROFESOR = 'PROFESOR',
  ALUMNO = 'ALUMNO',
  BEDEL = 'BEDEL',
  ADMIN = 'ADMIN'
}

@Injectable({ providedIn: 'root' })
export class UserService {

  private panel = new BehaviorSubject<string>("");
  private role = new BehaviorSubject<string>("");

  constructor() {}

  setPanel(panel: string) {
    this.panel.next(panel);
  }

  currentPanel(): Observable<string> {
    return this.panel.asObservable();
  }

  setRole(role: string) {
    console.log("Role seteado en userService:", role);
    this.role.next(role);
  }

  currentRole(): Observable<string> {
    return this.role.asObservable();
  }
}
