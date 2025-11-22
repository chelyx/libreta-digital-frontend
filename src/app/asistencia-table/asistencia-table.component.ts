import { Component, OnInit, Input } from '@angular/core';
import { UUID } from 'crypto';
import { ApiService } from 'src/core/service/api.service';
import { AsistenciaAlumnoDto, AsistenciaResponse } from 'src/core/models/asistencia';

interface Curso {
id: string;
nombre: string;
codigo: string;
}

interface AsistenciasPorAlumno {
auth0Id: string;
nombre: string;
registros: AsistenciaResponse[];
}

@Component({
selector: 'app-asistencia-table',
templateUrl: './asistencia-table.component.html',
styleUrls: ['./asistencia-table.component.scss'],
})
export class AsistenciaTableComponent implements OnInit {
@Input() cursos: Curso[] = [];

cursoSeleccionado: string | null = null;
cursoIdBusqueda: string = '';
asistencias: AsistenciaResponse[] = [];
cargando = false;
errorMsg = '';

// 🔴 AHORA LA CLAVE ES (alumno + fecha), NO SOLO auth0Id
private asistenciasBackup: Map<string, AsistenciaResponse> = new Map();

constructor(private api: ApiService) {}

  ngOnInit(): void {}

  // ================================
  //   AGRUPAR ASISTENCIAS POR ALUMNO
  // ================================
  get asistenciasPorAlumno(): AsistenciasPorAlumno[] {
    const map = new Map<string, AsistenciasPorAlumno>();

    for (const a of this.asistencias) {
      const id = (a as any).auth0Id || (a as any).id;
      const nombre = (a as any).nombre || id;

      if (!id) continue;

      if (!map.has(id)) {
        map.set(id, {
          auth0Id: id,
          nombre,
          registros: [],
        });
      }
      map.get(id)!.registros.push(a);
    }

    return Array.from(map.values());
  }

  // ================================
  //        BUSQUEDAS Y CURSOS
  // ================================
  onCursoChange(): void {
    if (!this.cursoSeleccionado) {
      this.asistencias = [];
      return;
    }
    this.cursoIdBusqueda = '';
    this.cargarAsistencias(this.cursoSeleccionado);
  }

  buscarCurso(): void {
    if (this.cursoSeleccionado) {
      this.cargarAsistencias(this.cursoSeleccionado);
    } else if (this.cursoIdBusqueda.trim()) {
      this.onBuscarPorId();
    } else {
      this.errorMsg = 'Selecciona un curso o ingresa un código para buscar.';
    }
  }

  onBuscarPorId(): void {
    const codigo = this.cursoIdBusqueda.trim();
    if (!codigo) {
      return;
    }

    this.cargando = true;
    this.errorMsg = '';
    this.asistencias = [];

    this.api.getCursoPorCodigo(codigo).subscribe({
      next: (curso: Curso) => {
        if (curso && curso.id) {
          this.cursoSeleccionado = curso.id;
          this.cargarAsistencias(curso.id);
        } else {
          this.errorMsg = 'No se encontró un curso con ese código.';
          this.cargando = false;
        }
      },
      error: (err: any) => {
        console.error('[asistencia-table] getCursoPorCodigo error', err);
        this.errorMsg =
          err?.status === 404
            ? 'No se encontró un curso con ese código'
            : 'Ocurrió un error buscando el curso';
        this.cargando = false;
      },
    });
  }

  private cargarAsistencias(cursoId: string): void {
    this.cargando = true;
    this.errorMsg = '';
    this.asistencias = [];

    this.api.getAsistenciaPorCurso(cursoId as unknown as UUID).subscribe({
      next: (res: AsistenciaResponse[]) => {
        this.asistencias = res || [];
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('[asistencia-table] cargarAsistencias error', err);
        this.errorMsg = 'No se pudieron cargar las asistencias del curso.';
        this.cargando = false;
      },
    });
  }

  // ================================
  //           EDICIÓN
  // ================================

  // 👉 clave única por asistencia: auth0Id + fecha (ya normalizada)
  private getAsistenciaKey(a: AsistenciaResponse): string {
    const fecha = this.formatearFechaISO(a.fecha);
    return `${a.auth0Id}-${fecha}`;
  }

  estaEditando(a: AsistenciaResponse): boolean {
    const key = this.getAsistenciaKey(a);
    return this.asistenciasBackup.has(key);
  }

  editarAsistencia(a: AsistenciaResponse): void {
    const key = this.getAsistenciaKey(a);
    if (!this.asistenciasBackup.has(key)) {
      // guardamos copia para poder cancelar
      this.asistenciasBackup.set(key, { ...a });
    }
  }

  cambiarPresente(a: AsistenciaResponse, presente: boolean): void {
    a.presente = presente;
  }

  cancelarEdicion(a: AsistenciaResponse): void {
    const key = this.getAsistenciaKey(a);
    const original = this.asistenciasBackup.get(key);
    if (original) {
      Object.assign(a, original);
      this.asistenciasBackup.delete(key);
    }
  }

 guardarAsistencia(a: AsistenciaResponse): void {
  const asistenciaActualizada: AsistenciaAlumnoDto = {
    alumnoId: a.auth0Id,
    presente: a.presente,
    // 👇 Enviamos la fecha EXACTA que vino del backend
    fecha: a.fecha as any,
  };

  const key = this.getAsistenciaKey(a);

  // salimos del modo edición (optimista)
  this.asistenciasBackup.delete(key);

  this.api
    .actualizarAsistenciaAlumno(String((a as any).cursoId), asistenciaActualizada)
    .subscribe({
      next: () => {
        console.log(
          '[asistencia-table] Asistencia actualizada con éxito para alumno:',
          a.auth0Id
        );
      },
      error: (err: any) => {
        console.error(
          '[asistencia-table] Error al actualizar asistencia para alumno:',
          a.auth0Id,
          err
        );
      },
    });
}


  private formatearFechaISO(fecha: string | Date): string {
    if (fecha instanceof Date) {
      return fecha.toISOString().split('T')[0];
    }
    if (typeof fecha === 'string') {
      return fecha.split('T')[0];
    }
    return '';
  }
}
