import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { RouterModule, Routes } from '@angular/router';

import { CargaFinalesComponent } from './pages/carga-finales/carga-finales.component';
import { SelectorMateriaMesaComponent } from './components/selector-materia-mesa/selector-materia-mesa.component';
import { TablaCargaNotasComponent } from './components/tabla-carga-notas/tabla-carga-notas.component';

const routes: Routes = [
  { path: '', component: CargaFinalesComponent }
];

@NgModule({
  declarations: [
    CargaFinalesComponent,
    SelectorMateriaMesaComponent,
    TablaCargaNotasComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatButtonModule, MatSelectModule, MatFormFieldModule, MatInputModule,
    RouterModule.forChild(routes)
  ]
})
export class CalificacionesModule {}
