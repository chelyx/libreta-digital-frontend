import { Component } from '@angular/core';
import { AuthService as Auth0Auth } from '@auth0/auth0-angular';
import { AuthService as AppAuth } from '../../core/services/auth.service';
import { ApiService } from 'src/service/apiService';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  title = 'libreta-digital';
  returnTo = window.location.origin;

  constructor(
    public auth: Auth0Auth,   // servicio de Auth0 para login/logout
    private appAuth: AppAuth, // servicio que guarda usuario/roles
    private api: ApiService
  ) {
    // mostrar info del usuario en consola y setear roles locales
    this.auth.user$.subscribe(user => {
      if (user) {
        console.log('✅ User logged in (Auth0):', user);

        const email = (user.email || user.preferred_username || user.name || '').toString();
        this.appAuth.loginFromEmail(email, user.name || undefined);
        console.log('➡️ Roles asignados:', this.appAuth.roles);

      } else {
        console.log('⛔ No user logged in');
        this.appAuth.logout();
      }
    });
  }

  llamarApi() {
    this.api.getProtegido('/api/hello').subscribe({
      next: (res) => console.log('✅ Respuesta:', res),
      error: (err) => console.error('❌ Error:', err)
    });
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: this.returnTo } });
  }

  login(): void {
    this.auth.loginWithRedirect();
  }
}
