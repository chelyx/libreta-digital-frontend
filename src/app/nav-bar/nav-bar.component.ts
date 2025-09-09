import { Component } from '@angular/core';
import { AuthService as Auth0Auth } from '@auth0/auth0-angular';
import { AuthService as AppAuth } from '../../core/services/auth.service';
import { ApiService } from 'src/service/apiService';
import emailjs from '@emailjs/browser';
import { environment } from 'src/environments/environment';

import { UserService } from 'src/service/userService';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  role ="";
  title = 'libreta-digital';
  returnTo = window.location.origin;

  constructor(
    public auth: Auth0Auth,
    private router: Router,
    private userService: UserService,
  ) {
   this.auth.idTokenClaims$.subscribe(claims => {
      this.role = claims?.['https://sirca.com/roles'][0] || null;
    });

  }

  show(link: string): void {
  //  this.router.navigateByUrl(link);
  this.userService.setPanel(link);
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: this.returnTo } });
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
    }, (e:any) => {
      console.error('❌ Error EmailJS', e);
    });
  }

}
