import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Curso } from 'src/core/models/curso';
import { ApiService } from 'src/core/service/api.service';
import { UserService, ROLES } from 'src/core/service/userService';
import { UxService, PANELES, Actions, MainCard } from 'src/core/service/ux.service';

@Component({
selector: 'app-home',
templateUrl: './home.component.html',
styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
role: string = '';
currentPanel: string = "";
sircaRoles = 'https://sirca.com/roles';
PANELES = PANELES;
ROLES = ROLES;

constructor(private auth: AuthService, public userService: UserService, public ux: UxService, private apiService: ApiService ) {}
  mainCards: MainCard[] = [];
  actions: Actions[] = [];
  cursos: Curso[] = [];
  ngOnInit(): void {
    this.auth.idTokenClaims$.subscribe(claims => {
      this.role = claims?.[this.sircaRoles][0] || null;
      this.userService.setRole(this.role!);
      this.ux.role = this.role;
      this.actions = this.ux.getActionsByRole();
      this.mainCards = this.ux.getMainCardsByRole();
    });

    this.ux.currentPanel().subscribe(panel => {
      this.currentPanel = panel;
    });

    this.validatePendingCode();
    this.getInfoByRole();
  }

  validatePendingCode(): void {
    const code = sessionStorage.getItem('pendingCode');
    if (code && this.role === ROLES.PROFESOR) {
      this.ux.setPanel(PANELES.CODE_VALIDATOR);
    }
  }

  getInfoByRole() {
 this.apiService.getMisCursos().subscribe({
      next: (data) => (this.cursos = data),
      error: (err) => console.error('Error al cargar cursos', err)
    });
  }

  navigateToPanel(panel: string): void {
    this.ux.setPanel(panel);
  }

  goToHome(): void {
    this.ux.setPanel('');
  }

  logout(): void {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin }
    });
  }
}
