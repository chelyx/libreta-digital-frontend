import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService, PANELES, ROLES } from 'src/core/service/userService';

@Component({
selector: 'app-home',
templateUrl: './home.component.html',
styleUrls: ['./home.component.scss']
})
export class HomeComponent {
currentPanel: string = "";
role: string | null = null;
sircaRoles = 'https://sirca.com/roles';

constructor(private auth: AuthService, public userService: UserService) {}

  ngOnInit(): void {
    this.auth.idTokenClaims$.subscribe(claims => {
      this.role = claims?.[this.sircaRoles][0] || null;
      this.userService.setRole(this.role!);
      console.log(this.role)

      // <CHANGE> No establecer panel por defecto para mostrar el dashboard
      // Comentamos estas líneas para que se muestre el dashboard inicial
      /*
      if (this.role === ROLES.ALUMNO) {
        this.userService.setPanel(PANELES.CODE_GENERATOR);
      } else if (this.role === ROLES.PROFESOR) {
        this.userService.setPanel(PANELES.CODE_VALIDATOR);
      }
      */
    });

    this.userService.currentPanel().subscribe(panel => {
      this.currentPanel = panel;
    });

    this.validatePendingCode();
  }

  validatePendingCode(): void {
    const code = sessionStorage.getItem('pendingCode');
    if (code && this.role === ROLES.PROFESOR) {
      this.userService.setPanel(PANELES.CODE_VALIDATOR);
    }
  }

  // <CHANGE> Nuevo método para navegar entre paneles
  navigateToPanel(panel: string): void {
    this.userService.setPanel(panel);
  }
}
