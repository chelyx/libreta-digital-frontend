import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

// Auth0 SDK
import { AuthService } from '@auth0/auth0-angular';



// Si lo usás en otros lados, lo dejo inyectado

import { ApiService } from 'src/core/service/apiService';
import { filter, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private auth0: AuthService,   // servicio de Auth0
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.auth0.isAuthenticated$
      .pipe(
        filter(loggedIn => loggedIn), // solo cuando esté logueado
        tap(() => {
          this.auth0.appState$.subscribe(appState => {
            const target = appState?.target || '/home';
            this.router.navigateByUrl(target);
          });
        })
      )
      .subscribe();

    // Nos enganchamos al perfil de Auth0
    // this.auth0.user$.subscribe(user => {
    //   if (user) {
    //     const email = (user.email || user.preferred_username || user.name || '').toString();
    //     // Guarda usuario local y asigna roles según EMAIL_ROLES / DOMAIN_ROLES
    //     this.appAuth.loginFromEmail(email, user.name || undefined);

    //     // (Opcional) si necesitás token para tu ApiService:
    //     // this.auth0.getAccessTokenSilently().subscribe(token => this.api.setToken(token));

    //     // Redirección por rol (podés quitar esto si preferís que navegue el usuario)
    //     if (this.appAuth.hasRole('BEDEL'))       { this.router.navigateByUrl('/bedel'); return; }
    //     if (this.appAuth.hasRole('PROFESOR'))    { this.router.navigateByUrl('/toma-de-asistencia'); return; }
    //     this.router.navigateByUrl('/mi-curso');  // default ALUMNO
    //   } else {
    //     // Limpia estado local si no hay sesión
    //     this.appAuth.logout();
    //   }
    // });
  }
}
