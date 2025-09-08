import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guard de Auth0 (si querés chequear sesión básica)
import { AuthGuard } from '@auth0/auth0-angular';

// Nuestro guard por roles
import { RoleGuard } from 'src/core/guards/role.guard';

// Componentes
import { TomaDeAsistenciaComponent } from './toma-de-asistencia/toma-de-asistencia.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';

// 🚀 Podés agregar otros componentes (Admin, MiCurso, etc.)
import { NavBarComponent } from './nav-bar/nav-bar.component';
// *ejemplo* — reemplazá por tu Admin real si lo tenés
// import { AdminComponent } from './admin/admin.component';
// import { MiCursoComponent } from './mi-curso/mi-curso.component';

const routes: Routes = [
  { path: '', redirectTo: 'asistencia', pathMatch: 'full' },

  // Solo ADMIN y PROFESOR pueden ver la toma de asistencia
  {
    path: 'asistencia',
    component: TomaDeAsistenciaComponent,
    canActivate: [AuthGuard, RoleGuard],   // chequea login + rol
    data: { roles: ['BEDEL', 'PROFESOR'] }
  },

  // Ejemplo: ruta Admin
  // {
  //   path: 'admin',
  //   component: AdminComponent,
  //   canActivate: [AuthGuard, RoleGuard],
  //   data: { roles: ['ADMIN'] }
  // },

  // Ejemplo: ruta Alumno
  // {
  //   path: 'mi-curso',
  //   component: MiCursoComponent,
  //   canActivate: [AuthGuard, RoleGuard],
  //   data: { roles: ['ALUMNO'] }
  // },

  // Página 403
  { path: '403', component: ForbiddenComponent },

  // Wildcard
  { path: '**', redirectTo: 'asistencia' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
