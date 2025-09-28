import { Component } from '@angular/core';
import { AuthService as Auth0Auth } from '@auth0/auth0-angular';
import emailjs from '@emailjs/browser';
import { environment } from 'src/environments/environment';

import { UserService } from 'src/core/service/userService';
import { Router } from '@angular/router';
import { PANELES } from 'src/core/service/userService';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  PANELES = PANELES; // Hacemos accesible el enum en el template
  role ="";
  returnTo = environment.redirectUri;
  currentPanel = "";
  constructor(
    public auth: Auth0Auth,
    private userService: UserService,
  ) {

    this.userService.currentPanel().subscribe(panel => {
      this.currentPanel = panel;
    });
    this.userService.currentRole().subscribe(role => {
      this.role = role;
    });

  }

  show(link: string): void {
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
