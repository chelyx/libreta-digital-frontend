import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Curso } from 'src/core/models/curso';
import { NotaDto, NotaResponse } from 'src/core/models/notas';
import { ApiService } from 'src/core/service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WizardService } from 'src/core/service/wizard.service';

@Component({
selector: 'app-notas-table',
templateUrl: './notas-table.component.html',
styleUrls: ['./notas-table.component.scss']
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
      this.alumnosPresentes = this.wizard.notas.map(nota => ({
        alumnoId: nota.alumnoId,
        alumnoNombre:
          this.curso.alumnos.find(a => a.auth0Id === nota.alumnoId)?.nombre || '',
        valor: nota.valor === null ? 'AUS' : nota.valor
      }));
      return;
    }

    this.apiService.getAsistenciaPorCurso(this.curso.id).subscribe({
      next: asistencias => {
        this.alumnosPresentes = asistencias.map(a => ({
          alumnoId: a.auth0Id,
          alumnoNombre: a.nombre,
          valor: a.presente ? null : 'AUS'
        }));

        this.alumnosPresentes.sort((a, b) => {
          if (a.valor === 'AUS' && b.valor !== 'AUS') return 1;
          if (b.valor === 'AUS' && a.valor !== 'AUS') return -1;
          return a.alumnoNombre.localeCompare(b.alumnoNombre);
        });
      },
      error: err => {
        console.error('Error al cargar notas', err);
      }
    });
  }

  // -----------------------------
  // VALIDACIÓN
  // -----------------------------

  private esNotaValida(valor: any): boolean {
    if (valor === null || valor === undefined || valor === '' || valor === 'AUS') {
      return true;
    }
    const num = Number(valor);
    return Number.isFinite(num) && num >= 1 && num <= 10;
  }

  onNotaChange(alumno: any, nuevoValor: any): void {
    if (nuevoValor === '' || nuevoValor === null || nuevoValor === undefined) {
      alumno.valor = null;
      return;
    }

    const num = Number(nuevoValor);

    if (!this.esNotaValida(num)) {
      this.snackBar.open('La nota debe ser un número entre 1 y 10', 'Cerrar', {
        duration: 2500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      alumno.valor = null;
    } else {
      alumno.valor = num;
    }
  }

  // -----------------------------
  // GUARDAR
  // -----------------------------

  guardarNotas() {
    if (!this.curso) {
      console.error('No hay curso seleccionado');
      return;
    }

    const invalidos = this.alumnosPresentes.filter(
      a => !this.esNotaValida(a.valor)
    );

    if (invalidos.length > 0) {
      this.snackBar.open(
        'Revisá las notas: deben ser números entre 1 y 10',
        'Cerrar',
        {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        }
      );
      return;
    }

    const notas: NotaDto[] = this.alumnosPresentes.map(a => ({
      alumnoId: a.alumnoId,
      valor: a.valor === 'AUS' ? null : (a.valor as number | null),
      descripcion: 'Final'
    }));

    this.apiService.saveNotas(this.curso.id, notas).subscribe({
      next: (res: NotaResponse[]) => {
        this.snackBar.open('✓ Notas cargadas exitosamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.completed.emit(res);
      },
      error: err => {
        console.error('Error guardando notas', err);
      }
    });
  }
}
