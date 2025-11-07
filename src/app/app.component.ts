import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from 'src/core/service/api.service';
import { filter, tap } from 'rxjs';
import { SyncService } from 'src/core/service/sync.service';

@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

constructor(
    private auth0: AuthService,
    private router: Router,
    private sync: SyncService
  ) {}

  ngOnInit(): void {
    this.auth0.isAuthenticated$
      .pipe(
        filter(loggedIn => loggedIn),
        tap(() => {
          this.auth0.appState$.subscribe(appState => {
            const target = appState?.target || '/home';
            this.router.navigateByUrl(target);
          });
        })
)
.subscribe();
  }
}
