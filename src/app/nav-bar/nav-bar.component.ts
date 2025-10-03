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
  ) {
    console.log('[v0] NavBarComponent constructor called');
  }

  ngOnInit(): void {
    console.log('[v0] NavBarComponent ngOnInit called');
    this.userService.currentPanel().subscribe((panel) => {
      console.log('[v0] Current panel:', panel);
      this.currentPanel = panel;
    });

    this.userService.currentRole().subscribe((role) => {
      console.log('[v0] Current role:', role);
      this.role = role;
    });
  }

  show(link: string): void {
    console.log('[v0] show() called with link:', link);
    this.userService.setPanel(link);
  }

  goToHome(): void {
    console.log('[v0] goToHome() called');
    this.userService.setPanel('');
    this.router.navigate(['/home']);
  }

  logout(): void {
    console.log('[v0] logout() called');
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin }
    });
  }
}
