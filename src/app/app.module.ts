import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockAsistenciasInterceptor } from './mocks/mock-asistencias.interceptor';


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

import { CodeGeneratorComponent } from './code-generator/code-generator.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CodeValidatorComponent } from './code-validator/code-validator.component';
import { MisMateriasComponent } from './mis-materias/mis-materias.component';
import { SelectorMateriaMesaComponent } from './carga-finales/selector-materia-mesa/selector-materia-mesa.component';
import { CargaFinalesComponent } from './carga-finales/carga-finales.component';
import { TablaCargaNotasComponent } from './carga-finales/tabla-carga-notas/tabla-carga-notas.component';
import { QRCodeModule } from 'angularx-qrcode';
import { environment } from '../environments/environment';
import { env } from 'process';
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    TomaDeAsistenciaComponent,
    CodeGeneratorComponent,
    HomeComponent,
    LoginComponent,
    CodeValidatorComponent,
    MisMateriasComponent,
    SelectorMateriaMesaComponent,
    CargaFinalesComponent,
    TablaCargaNotasComponent

  ],
  imports: [
    QRCodeModule,
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
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,
      authorizationParams: {
        redirect_uri: environment.redirectUri,
        audience: environment.auth0Audience,
        scope: environment.auth0Scope
      },
      cacheLocation: 'localstorage', // útil para mantener sesión después de reload
      useRefreshTokens: true
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockAsistenciasInterceptor,
      multi: true,
    },
],
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
