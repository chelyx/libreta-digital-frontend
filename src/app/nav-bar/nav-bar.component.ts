import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Actions, UxService } from 'src/core/service/ux.service';

@Component({
selector: 'app-nav-bar',
templateUrl: './nav-bar.component.html',
styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnChanges {
  @Input() role: string = '';
  currentPanel: string = '';
  menuOpen: boolean = false;
  links: Actions[] = [];

constructor(
    public auth: AuthService,
    private ux: UxService,
  ) {
  }

  ngOnInit(): void {
    this.ux.currentPanel().subscribe((panel) => {
      this.currentPanel = panel;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role']) {
      this.links = this.ux.getActionsByRole();
    }
  }


  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }


  show(link: string): void {
    this.ux.setPanel(link);
    this.menuOpen = false;
  }

  goToHome(): void {
    this.ux.setPanel('');
   // this.router.navigate(['/home']);
  }

  logout(): void {
    this.auth.logout({
      logoutParams: { returnTo: document.location.origin }
    });
  }
}
