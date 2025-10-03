import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService, PANELES } from 'src/core/service/userService';
import { Router } from '@angular/router';

@Component({
selector: 'app-nav-bar',
templateUrl: './nav-bar.component.html',
styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
currentPanel: string = '';
role: string = '';
PANELES = PANELES;

constructor(
    public auth: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.currentPanel().subscribe((panel) => {
      this.currentPanel = panel;
    });

    this.userService.currentRole().subscribe((role) => {
      this.role = role;
    });
  }

  show(link: string): void {
    this.userService.setPanel(link);
  }

goToHome(): void {
  console.log('[v0] goToHome called');
  // Primero limpia el panel actual para mostrar la vista de bienvenida
  this.userService.setPanel('');
  // Luego navega a /home (esto fuerza un refresh si ya estás ahí)
  this.router.navigate(['/home']);
}

  logout(): void {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin }
    });
  }
}
