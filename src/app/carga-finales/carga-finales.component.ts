import { Component, Input, OnInit } from '@angular/core';
import { UUID } from 'crypto';
import { Curso } from 'src/core/models/curso';
import { User } from 'src/core/models/user';
import { ApiService } from 'src/core/service/api.service';

@Component({
selector: 'app-carga-finales',
templateUrl: './carga-finales.component.html',
styleUrls: ['./carga-finales.component.scss']
})
export class CargaFinalesComponent implements OnInit {
 @Input() cursos: Curso[] = [];

cursoSeleccionado: UUID = '' as UUID;
alumnosDto: { auth0Id: string; nota: number; notaFinal: number; nombre: string }[] = [];

constructor(private apiService: ApiService) {}

ngOnInit(): void {}

onCursoChange(cursoId: UUID) {
  this.cursoSeleccionado = cursoId;
  this.cargarAlumnosConNotas(cursoId);
}

cargarAlumnosConNotas(cursoId: string) {
 this.apiService.getNotasByCurso(cursoId as UUID).subscribe({
   next: (notasData) => {
     this.alumnosDto = notasData.map(nota => ({
        auth0Id: nota.alumnoId,
        nota: nota.valor,
        notaFinal: nota.valor,
        nombre: nota.alumnoNombre  // Asegurate de que el backend envíe el nombre del alumno
     }));
   },
   error: (err) => {
     console.error('Error cargando notas', err);
   }
 });
}

guardarNotas() {
  const notas = this.alumnosDto.map(a => ({
    alumnoId: a.auth0Id,                // o el campo que uses como ID en tu modelo
    descripcion: 'Final',     // podés hacerlo dinámico si querés
    valor: Number(a.nota)               // el valor numérico de la nota
  }));

  this.apiService.saveNotas(this.cursoSeleccionado, notas)
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
  return this.alumnosDto.some(a => a.nota !== a.notaFinal);
}

getCambiosCount(): number {
  return this.alumnosDto.filter(a => a.nota !== a.notaFinal).length;
}

}
