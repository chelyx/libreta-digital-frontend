import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ROLES {
  PROFESOR = 'PROFESOR',
  ALUMNO = 'ALUMNO',
  BEDEL = 'BEDEL',
  ADMIN = 'ADMIN'
}

@Injectable({ providedIn: 'root' })
export class UserService {

  private role = new BehaviorSubject<string>("");

  constructor() {}

  setRole(role: string) {
    console.log("Role seteado en userService:", role);
    this.role.next(role);
  }

  currentRole(): Observable<string> {
    return this.role.asObservable();
  }
}
