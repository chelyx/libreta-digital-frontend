import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaginaOpcionesComponent } from './pagina-opciones/pagina-opciones.component';

const routes: Routes = [
  { path: 'calificaciones', loadChildren: () => import('./calificaciones/calificaciones.module').then(m => m.CalificacionesModule) },
  { path: 'pagina-opciones', component: PaginaOpcionesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
