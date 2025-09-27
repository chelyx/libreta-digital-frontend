import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from 'src/core/service/userService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentPanel: string = "";
  role: string | null = null;

  constructor(private auth: AuthService, public userService: UserService) {}

  ngOnInit(): void {
    this.auth.idTokenClaims$.subscribe(claims => {
      this.role = claims?.['https://sirca.com/roles'][0] || null;
      console.log(this.role)
    });

    this.userService.panel$.subscribe(panel => {
      console.log("Panel cambiado a:", panel);
      this.currentPanel = panel;
    });

    this.validatePendingCode();
  }

   validatePendingCode(): void {
    const code = sessionStorage.getItem('pendingCode');
    if (code) {
      // Aquí llamás al modulo para validar
      console.log('Token a validar:', code);
      this.userService.setPanel('code-validator');
    }
  }

}
