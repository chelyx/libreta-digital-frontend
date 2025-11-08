import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CertificateValidatorComponent } from './certificate-validator/certificate-validator.component';

const routes: Routes = [
{ path: '', redirectTo: 'login', pathMatch: 'full' },
{ path: 'login', component: LoginComponent },
{ path: 'home', component: HomeComponent },

// Nueva ruta para el validador (sin guard por ahora)
{
path: 'validador-certificados',
component: CertificateValidatorComponent
},

{ path: '**', redirectTo: 'login' },
];

@NgModule({
imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
