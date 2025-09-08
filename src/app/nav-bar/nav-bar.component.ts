import { Component } from '@angular/core';
import { AuthService as Auth0Auth } from '@auth0/auth0-angular';
import { AuthService as AppAuth } from '../../core/services/auth.service';
import { ApiService } from 'src/service/apiService';
import { UserService } from 'src/service/userService';

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
    private api: ApiService,
    private userService: UserService
  ) {
    // mostrar info del usuario en consola y setear roles locales
    this.auth.user$.subscribe(user => {
      if (user) {
        console.log('✅ User logged in (Auth0):', user);
         this.getRoles();
        const email = (user.email || user.preferred_username || user.name || '').toString();
        this.appAuth.loginFromEmail(email, user.name || undefined);
        console.log('➡️ Roles asignados:', this.appAuth.roles);

      } else {
        console.log('⛔ No user logged in');
        this.appAuth.logout();
      }
    });

  }


  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: this.returnTo } });
  }

  login(): void {
    this.auth.loginWithRedirect();
  }
  getRoles(): void {
    this.api.getRoles().subscribe({
      next: (res) => {
        this.userService.setRoles(res.roles);
        console.log('Roles obtenidos:', res.roles);
      },
      error: (err) => {
        this.userService.setRoles([]);
        console.error('Error al obtener roles:', err);
      }
    });
  }

}
