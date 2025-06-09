import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from 'src/service/apiService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(@Inject(AuthService) public auth: AuthService, private api: ApiService) {
      this.auth.user$.subscribe(user => {
    if (user) {
      console.log('User logged in:', user);
    } else {
      console.log('No user logged in');
    }
  });
  }
  title = 'libreta-digital';
  returnTo = window.location.origin;

  llamarApi() {
    this.api.getProtegido('/api/hello').subscribe(
      res => console.log('✅ Respuesta:', res),
      err => console.error('❌ Error:', err)
    );
  }
  logout(): void {
  this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
}

login(): void {
  this.auth.loginWithRedirect()

}

}
