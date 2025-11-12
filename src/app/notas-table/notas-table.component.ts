import { Component, Input } from '@angular/core';
import { UUID } from 'crypto';
import { Curso } from 'src/core/models/curso';
import { NotaDto, NotaResponse } from 'src/core/models/notas';
import { ApiService } from 'src/core/service/api.service';

@Component({
  selector: 'app-notas-table',
  templateUrl: './notas-table.component.html',
  styleUrls: ['./notas-table.component.scss']
})
export class NotasTableComponent {
@Input() cursos: Curso[] = [];

cursoSeleccionado: UUID = '' as UUID;
notas: NotaResponse[] = [];

constructor(private apiService: ApiService) {}

ngOnInit(): void {}

onCursoChange(cursoId: UUID) {
  this.cursoSeleccionado = cursoId;
  this.cargarAlumnosConNotas(cursoId);
}

cargarAlumnosConNotas(cursoId: string) {
 this.apiService.getNotasByCurso(cursoId as UUID).subscribe({
   next: (notasData) => {
      this.notas = notasData;
   },
   error: (err) => {
     console.error('Error cargando notas', err);
   }
 });
}

guardarNotas() {
  let notas: NotaDto[] = this.notas
    .map(a => ({
      id: a.id,
      valor: a.valor
    }));
  let notasBulkDto = {
    cursoId: this.cursoSeleccionado,
    notas: notas
  }
  this.apiService.updateNotas(notasBulkDto)
    .subscribe({
      next: (res) => {
        console.log('Notas guardadas correctamente', res);
        // Podés mostrar un snackbar o notificación
      },
      error: (err) => {
        console.error('Error guardando notas', err);
      }
    });
}

hayCambios(): boolean {
  return true
  // return this.notas.some(a => a.nota !== a.notaFinal);
}

getCambiosCount(): number {
  return 0;
  //return this.notas.filter(a => a.nota !== a.notaFinal).length;
}

}
