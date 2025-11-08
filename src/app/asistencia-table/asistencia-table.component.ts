import { Component, OnInit, Input } from '@angular/core';
import { UUID } from 'crypto';
import { ApiService } from 'src/core/service/api.service';
import { AsistenciaResponse } from 'src/core/models/asistencia';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Curso {
id: string;
nombre: string;
codigo: string;
}

@Component({
selector: 'app-asistencia-table',
templateUrl: './asistencia-table.component.html',
styleUrls: ['./asistencia-table.component.scss']
})
export class AsistenciaTableComponent implements OnInit {
@Input() cursos: Curso[] = [];

cursoSeleccionado: string = '';
cursoIdBusqueda: string = '';

asistencias: AsistenciaResponse[] = [];
editandoId: string | null = null;
valorOriginal: boolean = false;

cargando = false;
errorMsg = '';

constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    console.log('[v0] Cursos recibidos:', this.cursos);
  }

  toggleMenu(): void {
    console.log('[v0] Menu toggled');
  }

  onCursoChange(): void {
    if (this.cursoSeleccionado) {
      this.cursoIdBusqueda = '';
    }
    console.log('[v0] Curso seleccionado:', this.cursoSeleccionado);
  }

  onBuscarPorId(): void {
    console.log('[v0] Buscando por ID:', this.cursoIdBusqueda);

    const codigo = (this.cursoIdBusqueda || '').trim();

    if (!codigo) {
      this.errorMsg = 'Ingresá un código de curso';
      return;
    }

    this.cargando = true;
    this.errorMsg = '';
    this.asistencias = [];

    this.api.getCursoPorCodigo(codigo).subscribe({
      next: (curso: Curso) => {
        const cursoId = curso?.id as unknown as UUID;
        this.cursoSeleccionado = String(cursoId);

        this.api.getAsistenciaPorCurso(cursoId).subscribe({
          next: (res) => {
            this.asistencias = res || [];
            this.cargando = false;
          },
          error: (err) => {
            console.error('[asistencia-table] getAsistenciaPorCurso error', err);
            this.errorMsg = 'No se pudieron cargar las asistencias del curso.';
            this.cargando = false;
          }
        });
      },
      error: (err) => {
        console.error('[asistencia-table] getCursoPorCodigo error', err);
        this.errorMsg = err?.status === 404
          ? 'No se encontró un curso con ese código'
          : 'Ocurrió un error buscando el curso';
        this.cargando = false;
      }
    });
  }

  onCursoSelectChange(cursoId: string): void {
    this.cursoSeleccionado = cursoId;
    if (!cursoId) {
      this.asistencias = [];
      return;
    }
    this.cargando = true;
    this.errorMsg = '';
    this.api.getAsistenciaPorCurso(cursoId as unknown as UUID).subscribe({
      next: (res) => {
        this.asistencias = res || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('[asistencia-table] getAsistenciaPorCurso error', err);
        this.errorMsg = 'No se pudieron cargar las asistencias del curso.';
        this.cargando = false;
      }
    });
  }

  hayAsistencias(): boolean {
    return Array.isArray(this.asistencias) && this.asistencias.length > 0;
  }

  buscarCurso(): void {
    const cursoId = this.cursoSeleccionado || this.cursoIdBusqueda;

    if (cursoId) {
      console.log('[v0] Buscando curso con ID:', cursoId);
    } else {
      console.warn('No se ha seleccionado ningún curso');
    }
  }

  editarAsistencia(asistencia: AsistenciaResponse): void {
    this.editandoId = asistencia.id;
    this.valorOriginal = asistencia.presente;
  }

  cambiarPresente(asistencia: AsistenciaResponse, nuevoValor: boolean): void {
    asistencia.presente = nuevoValor;
  }

  guardarAsistencia(asistencia: AsistenciaResponse): void {
    const asistenciaDto = {
      alumnoId: asistencia.id,
      presente: asistencia.presente,
      fecha: new Date(asistencia.fecha)
    };

    this.api.saveAsistencia(this.cursoSeleccionado as unknown as UUID, [asistenciaDto]).subscribe({
      next: () => {
        this.snackBar.open('✓ Asistencia actualizada correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.editandoId = null;
      },
      error: (err: any) => {
        console.error('Error actualizando asistencia', err);
        this.snackBar.open('Error al actualizar la asistencia', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
        asistencia.presente = this.valorOriginal;
        this.editandoId = null;
      }
    });
  }

  cancelarEdicion(asistencia: AsistenciaResponse): void {
    asistencia.presente = this.valorOriginal;
    this.editandoId = null;
  }

  estaEditando(asistencia: AsistenciaResponse): boolean {
    return this.editandoId === asistencia.id;
  }
}
