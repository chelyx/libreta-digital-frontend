import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Auth0 SDK
import { AuthService as Auth0Auth } from '@auth0/auth0-angular';

// Tu servicio de sesión/roles (el que creamos con loginFromEmail)
import { AuthService as AppAuth } from '../core/services/auth.service';

// Si lo usás en otros lados, lo dejo inyectado
import { ApiService } from 'src/service/apiService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private auth0: Auth0Auth,   // servicio de Auth0
    private appAuth: AppAuth,   // tu servicio que guarda email/roles
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    // Nos enganchamos al perfil de Auth0
    this.auth0.user$.subscribe(user => {
      if (user) {
        const email = (user.email || user.preferred_username || user.name || '').toString();

        // Guarda usuario local y asigna roles según EMAIL_ROLES / DOMAIN_ROLES
        this.appAuth.loginFromEmail(email, user.name || undefined);

        // (Opcional) si necesitás token para tu ApiService:
        // this.auth0.getAccessTokenSilently().subscribe(token => this.api.setToken(token));

        // Redirección por rol (podés quitar esto si preferís que navegue el usuario)
        if (this.appAuth.hasRole('BEDEL'))       { this.router.navigateByUrl('/bedel'); return; }
        if (this.appAuth.hasRole('PROFESOR'))    { this.router.navigateByUrl('/toma-de-asistencia'); return; }
        this.router.navigateByUrl('/mi-curso');  // default ALUMNO
      } else {
        // Limpia estado local si no hay sesión
        this.appAuth.logout();
      }
    });
  }
}
