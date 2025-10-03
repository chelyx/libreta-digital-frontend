import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService, PANELES, ROLES } from 'src/core/service/userService';

@Component({
selector: 'app-home',
templateUrl: './home.component.html',
styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
role: string = '';
currentPanel: string = "";
sircaRoles = 'https://sirca.com/roles';

constructor(private auth: AuthService, public userService: UserService) {}

  ngOnInit(): void {
  this.auth.idTokenClaims$.subscribe(claims => {
    console.log('[v0 HOME] Claims received:', claims);

    // <CHANGE> Solución temporal: extraer rol del email/nickname
    const email = claims?.['email'] as string || '';
    const nickname = claims?.['nickname'] as string || '';

    // Determinar rol basado en el email o nickname
    if (email.includes('bedel') || nickname.includes('bedel')) {
      this.role = 'BEDEL';
    } else if (email.includes('profesor') || nickname.includes('profesor')) {
      this.role = 'PROFESOR';
    } else {
      this.role = 'ALUMNO';
    }

    console.log('[v0 HOME] Role determined from email/nickname:', this.role);
    this.userService.setRole(this.role);
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

  navigateToPanel(panel: string): void {
    this.userService.setPanel(panel);
  }
}
