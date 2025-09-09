import { Component } from '@angular/core';
import { AuthService as Auth0Auth } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor( public auth: Auth0Auth, ) { }
 login(): void {
     this.auth.loginWithRedirect({
      appState: { target: '/home' }  // 👈 después de loguearse, redirige al /home
    });
  }
}
