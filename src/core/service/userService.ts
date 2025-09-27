import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {

  private panel = new BehaviorSubject<string>("");
  panel$ = this.panel.asObservable();

  constructor() {}

  setPanel(panel: string) {
    this.panel.next(panel);
  }

  currentPanel(): string {
    return this.panel.getValue();
  }
}
