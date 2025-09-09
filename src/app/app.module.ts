import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { TomaDeAsistenciaComponent } from './toma-de-asistencia/toma-de-asistencia.component';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

// Auth0
import { AuthModule } from '@auth0/auth0-angular';

// ⬇️ NUEVO: 403 y directiva por rol
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { HasRoleDirective } from './shared/directives/has-role.directive';
import { CodeGeneratorComponent } from './code-generator/code-generator.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CodeValidatorComponent } from './code-validator/code-validator.component';
import { MisMateriasComponent } from './mis-materias/mis-materias.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    TomaDeAsistenciaComponent,

    // ⬇️ NUEVO
    ForbiddenComponent,
    HasRoleDirective,

    CodeGeneratorComponent,
      HomeComponent,
      LoginComponent,
      CodeValidatorComponent,
      MisMateriasComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,

    // Material
    MatButtonModule,
    MatListModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,

    // Auth0 (tu configuración actual)
    AuthModule.forRoot({
      domain: 'dev-7tciizrz7pk84r8q.us.auth0.com',
      clientId: '0mGm99P2Jv3LhUKXOWPGDcYrhn3upEdg',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'http://localhost:8080',
        scope: 'openid profile email'
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIcon(
      'logo',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/logo.svg')
    );
    matIconRegistry.registerFontClassAlias('material-symbols-outlined', 'material-symbols-outlined');
    matIconRegistry.setDefaultFontSetClass('material-symbols-outlined');
  }
}
