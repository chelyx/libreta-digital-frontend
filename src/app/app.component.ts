import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

// Auth0 SDK
import { AuthService } from '@auth0/auth0-angular';



// Si lo usás en otros lados, lo dejo inyectado

import { ApiService } from 'src/core/service/api.service';
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


  }
}
