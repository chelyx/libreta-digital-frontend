import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// QR Code
import { QRCodeModule } from 'angularx-qrcode';

// Auth0
import { AuthModule } from '@auth0/auth0-angular';

// Components
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CodeValidatorComponent } from './code-validator/code-validator.component';
import { CodeGeneratorComponent } from './code-generator/code-generator.component';
import { AsistenciaTableComponent } from './asistencia-table/asistencia-table.component';
import { NotasTableComponent } from './notas-table/notas-table.component';
import { HistorialNotasComponent } from './historial-notas/historial-notas.component';
import { ExamenWizardComponent } from './examen-wizard/examen-wizard.component';
import { MisMateriasComponent } from './mis-materias/mis-materias.component';
import { TomaDeAsistenciaComponent } from './toma-de-asistencia/toma-de-asistencia.component';
import { StudentItemComponent } from './student-item/student-item.component';
import { HistorialAsistenciaComponent } from './historial-asistencia/historial-asistencia.component';

// Environment & Interceptors
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { OfflineInterceptor } from '../core/service/interceptor';

@NgModule({
declarations: [
AppComponent,
HomeComponent,
LoginComponent,
CodeValidatorComponent,
CodeGeneratorComponent,
AsistenciaTableComponent,
NotasTableComponent,
HistorialNotasComponent,
ExamenWizardComponent,
MisMateriasComponent,
TomaDeAsistenciaComponent,
StudentItemComponent,
HistorialAsistenciaComponent
],
imports: [
BrowserModule,
CommonModule,
RouterModule,
AppRoutingModule,
BrowserAnimationsModule,
FormsModule,
ReactiveFormsModule,
HttpClientModule,

// Material Modules
MatToolbarModule,
MatButtonModule,
MatCardModule,
MatInputModule,
MatFormFieldModule,
MatIconModule,
MatSidenavModule,
MatListModule,
MatDialogModule,
MatTableModule,
MatSortModule,
MatPaginatorModule,
MatSelectModule,
MatDatepickerModule,
MatNativeDateModule,
MatCheckboxModule,
MatStepperModule,
MatProgressBarModule,
MatChipsModule,
MatSnackBarModule,
MatProgressSpinnerModule,

// QR Code
QRCodeModule,

// Auth0
AuthModule.forRoot({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,
      authorizationParams: {
        redirect_uri: environment.redirectUri,
        audience: environment.auth0Audience,
        scope: environment.auth0Scope,
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
    }),

    // Service Worker
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000',
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: OfflineInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
