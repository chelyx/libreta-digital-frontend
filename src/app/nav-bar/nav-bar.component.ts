import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from 'src/service/apiService';
import { UserService } from 'src/service/userService';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

   constructor(@Inject(AuthService) public auth: AuthService, private api: ApiService, private userService: UserService) {
      this.auth.user$.subscribe(user => {
        if (user) {
          console.log('User logged in:', user);
          this.getRoles();
        } else {
          console.log('No user logged in');
        }
      });
    }
    title = 'libreta-digital';
    returnTo = window.location.origin;

    logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
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
