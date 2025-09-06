import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from 'src/service/apiService';
import emailjs from '@emailjs/browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

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

  probarEmail() {
    emailjs.init({ publicKey: environment.emailjs.publicKey });

    emailjs.send(
      environment.emailjs.serviceId,
      environment.emailjs.templateId,
      {
        to_email: 'TU_CORREO_DE_PRUEBA@gmail.com',
        to_name: 'Alumno de prueba',
        materia: 'Base de Datos',
        mesa_fecha: '2025-12-19',
        nota: '9'
      }
    ).then(() => {
      console.log('✅ Email enviado');
    }, (e) => {
      console.error('❌ Error EmailJS', e);
    });
  }
}
