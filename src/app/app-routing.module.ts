import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { TomaDeAsistenciaComponent } from './toma-de-asistencia/toma-de-asistencia.component';

const routes: Routes = [
  { path: '', redirectTo: 'asistencia', pathMatch: 'full' },
  { path: 'asistencia', component: TomaDeAsistenciaComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'asistencia' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
