import { Component, OnInit, Input } from '@angular/core';
import { UUID } from 'crypto';
import { ApiService } from 'src/core/service/api.service';
import { AsistenciaResponse } from 'src/core/models/asistencia';

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
cargando = false;
errorMsg = '';

constructor(private api: ApiService) {}

  ngOnInit(): void {
    console.log('[asistencia-table] Cursos recibidos:', this.cursos);
  }

  onCursoChange(): void {
    if (!this.cursoSeleccionado) {
      this.asistencias = [];
      return;
    }

    this.cursoIdBusqueda = '';
    this.cargando = true;
    this.errorMsg = '';

    console.log('[asistencia-table] Cargando asistencias del curso:', this.cursoSeleccionado);

    this.api.getAsistenciaPorCurso(this.cursoSeleccionado as unknown as UUID).subscribe({
      next: (res) => {
        this.asistencias = res || [];
        this.cargando = false;
        console.log('[asistencia-table] Asistencias cargadas:', this.asistencias);
      },
      error: (err) => {
        console.error('[asistencia-table] Error al cargar asistencias', err);
        this.errorMsg = 'No se pudieron cargar las asistencias del curso.';
        this.cargando = false;
      }
    });
  }

  onBuscarPorId(): void {
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
        if (curso && curso.id) {
          this.cursoSeleccionado = curso.id;
          this.api.getAsistenciaPorCurso(curso.id as unknown as UUID).subscribe({
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
        } else {
          this.errorMsg = 'No se encontró un curso con ese código.';
          this.cargando = false;
        }
      },
      error: (err) => {
        console.error('[asistencia-table] getCursoPorCodigo error', err);
        this.errorMsg =
          err?.status === 404
            ? 'No se encontró un curso con ese código'
            : 'Ocurrió un error buscando el curso';
        this.cargando = false;
      }
    });
  }

  buscarCurso(): void {
    const cursoId = this.cursoSeleccionado || this.cursoIdBusqueda;
    if (cursoId) {
      console.log('[asistencia-table] Buscando curso con ID:', cursoId);
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
    } else {
      console.warn('No se ha seleccionado ningún curso');
    }
  }

  editarAsistencia(asistencia: AsistenciaResponse): void {
    console.log('Editar asistencia de:', asistencia);
  }

  // Métodos auxiliares del modo edición (ya definidos en tu HTML)
  estaEditando(a: AsistenciaResponse): boolean {
    return (a as any)._editando === true;
  }

  editar(a: AsistenciaResponse): void {
    (a as any)._editando = true;
  }

  cancelarEdicion(a: AsistenciaResponse): void {
    (a as any)._editando = false;
  }

  cambiarPresente(a: AsistenciaResponse, valor: boolean): void {
    a.presente = valor;
  }

  guardarAsistencia(a: AsistenciaResponse): void {
    console.log('[asistencia-table] Guardando asistencia modificada:', a);
    (a as any)._editando = false;
    // acá podés implementar api.updateAsistencia(a.id, a) si lo necesitás
  }
}
