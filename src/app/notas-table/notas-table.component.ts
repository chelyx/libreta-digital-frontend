import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Curso } from 'src/core/models/curso';
import { NotaDto, NotaResponse } from 'src/core/models/notas';
import { ApiService } from 'src/core/service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WizardService } from 'src/core/service/wizard.service';

@Component({
selector: 'app-notas-table',
templateUrl: './notas-table.component.html',
styleUrls: ['./notas-table.component.scss'],
})
export class NotasTableComponent implements OnInit {
@Input() curso: Curso = {} as Curso;
@Output() completed = new EventEmitter<NotaResponse[]>();

alumnosPresentes: {
alumnoId: string;
alumnoNombre: string;
valor: number | 'AUS' | null;
}[] = [];

constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private wizard: WizardService
  ) {}

  ngOnInit(): void {
    this.cargarAlumnosConNotas();
  }

  cargarAlumnosConNotas() {
    if (this.wizard.notas.length > 0) {
      this.alumnosPresentes = this.wizard.notas.map((nota) => ({
        alumnoId: nota.alumnoId,
        alumnoNombre:
          this.curso.alumnos.find((a) => a.auth0Id === nota.alumnoId)?.nombre ||
          '',
        valor: nota.valor === null ? 'AUS' : nota.valor,
      }));
      return;
    } else {
      this.apiService.getAsistenciaPorCurso(this.curso.id).subscribe({
        next: (asistencias) => {
          this.alumnosPresentes = asistencias.map((a) => ({
            alumnoId: a.auth0Id,
            alumnoNombre: a.nombre,
            valor: a.presente ? null : 'AUS',
          }));

          this.alumnosPresentes.sort((a, b) => {
            if (a.valor === 'AUS' && b.valor !== 'AUS') return 1;
            if (b.valor === 'AUS' && a.valor !== 'AUS') return -1;

            return a.alumnoNombre.localeCompare(b.alumnoNombre);
          });
        },
        error: (err) => {
          console.error('Error al cargar notas', err);
        },
      });
    }
  }

  // 🔥 VALIDACIÓN DE NOTA 1-10
  validarNota(alumno: any) {
    let v = alumno.valor;

    if (v === null || v === '' || v === undefined) {
      alumno.valor = null;
      return;
    }

    // Si escriben letras o símbolos, lo borro
    if (isNaN(Number(v))) {
      alumno.valor = null;
      return;
    }

    v = Number(v);

    if (v < 1) alumno.valor = 1;
    else if (v > 10) alumno.valor = 10;
    else alumno.valor = v;
  }

  guardarNotas() {
    if (!this.curso) {
      console.error('No hay curso seleccionado');
      return;
    }

    let notas: NotaDto[] = this.alumnosPresentes.map((a) => ({
      alumnoId: a.alumnoId,
      valor: a.valor === 'AUS' ? null : a.valor,
      descripcion: 'Final',
    }));

    this.apiService.saveNotas(this.curso.id, notas).subscribe({
      next: (res: NotaResponse[]) => {
        console.log('Notas guardadas correctamente', res);
        this.snackBar.open('✓ Notas cargadas exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
        this.completed.emit(res);
      },
      error: (err) => {
        console.error('Error guardando notas', err);
      },
    });
  }
}
