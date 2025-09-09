import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { TomaDeAsistenciaComponent } from './toma-de-asistencia/toma-de-asistencia.component';
import { CodeValidatorComponent } from './code-validator/code-validator.component';
import { CodeGeneratorComponent } from './code-generator/code-generator.component';
import { MisMateriasComponent } from './mis-materias/mis-materias.component';
import { CalificacionesComponent } from './calificaciones/calificaciones.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // pantalla inicial → login
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent }, // aquí meterías nav-bar, asistencia, etc.


  // Acciones de profesor
  // { path: 'toma-asistencia', component: TomaDeAsistenciaComponent },
  // { path: 'validar-codigos', component: CodeValidatorComponent },
  //{path: 'calificaciones', component: CalificacionesComponent},

  // Acciones de alumno
  // { path: 'generar-codigo', component: CodeGeneratorComponent },
  // { path: 'mis-materias', component: MisMateriasComponent },


  { path: '**', redirectTo: 'login' }, // fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
