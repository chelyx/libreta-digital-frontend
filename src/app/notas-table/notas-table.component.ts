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
      error: err => console.error('Error cargando notas', err)
    });
  }

  // ============================================================
  // VALIDACIÓN FINAL: NO PERMITE ESCRIBIR MÁS QUE 1–10
  // ============================================================

  soloNumeros(event: KeyboardEvent) {
    const tecla = event.key;

    const teclasPermitidas = [
      'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'
    ];

    // permitir teclas de control
    if (teclasPermitidas.includes(tecla)) return;

    // permitir solo dígitos del 1 al 9
    if (!/^[0-9]$/.test(tecla)) {
      event.preventDefault();
      return;
    }
  }

  validarRango(event: any, alumno: any) {
    const valor = event.target.value;

    // bloquear pegado o caracteres no numéricos
    if (!/^\d*$/.test(valor)) {
      event.target.value = alumno.valor ?? '';
      return;
    }

    // permitir borrar
    if (valor === '') {
      alumno.valor = null;
      return;
    }

    const num = Number(valor);

    // bloquear menor a 1 y mayor a 10
    if (num < 1 || num > 10) {
      event.target.value = alumno.valor ?? '';
      return;
    }

    alumno.valor = num;
  }

  // ============================================================

  guardarNotas() {
    if (!this.curso) return;

    const notas: NotaDto[] = this.alumnosPresentes.map(a => ({
      alumnoId: a.alumnoId,
      valor: a.valor === 'AUS' ? null : a.valor,
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
      error: err => console.error('Error guardando notas', err)
    });
  }
}
