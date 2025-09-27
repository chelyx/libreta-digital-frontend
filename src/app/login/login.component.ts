import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService as Auth0Auth } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor( public auth: Auth0Auth, private route: ActivatedRoute,) { }
 login(): void {
   this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        // 2️⃣ Guardar en sessionStorage temporalmente
        sessionStorage.setItem('pendingCode', code);
      }
    });

    this.auth.loginWithRedirect({
      appState: { target: '/home' }  // 👈 después de loguearse, redirige al /home
    });
  }
}
