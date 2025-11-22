import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/core/service/api.service';
import { UUID } from 'crypto';
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

cursoSeleccionado: string = '';
cursoIdBusqueda: string = '';
asistencias: AsistenciaResponse[] = [];
cargando = false;
errorMsg = '';

// 👇 Ahora backup por (alumno + fecha normalizada)
private asistenciasBackup: Map<string, AsistenciaResponse> = new Map();

constructor(private api: ApiService) {}

  ngOnInit(): void {}

  // ============================================================
  // AGRUPAR POR ALUMNO → una sola fila por alumno
  // ============================================================
  get asistenciasPorAlumno(): AsistenciasPorAlumno[] {
    const map = new Map<string, AsistenciasPorAlumno>();

    for (const a of this.asistencias) {
      const auth0Id = a.auth0Id || (a as any).id;
      const nombre = a.nombre || auth0Id;

      if (!map.has(auth0Id)) {
        map.set(auth0Id, {
          auth0Id,
          nombre,
          registros: [],
        });
      }

      map.get(auth0Id)!.registros.push(a);
    }

    return Array.from(map.values());
  }

  // ============================================================
  // BUSCAR CURSO
  // ============================================================
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
      this.errorMsg = 'Selecciona un curso o ingresa un código.';
    }
  }

  onBuscarPorId(): void {
    const codigo = this.cursoIdBusqueda.trim();
    if (!codigo) return;

    this.cargando = true;
    this.errorMsg = '';

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
      error: () => {
        this.errorMsg = 'No se encontró un curso con ese código.';
        this.cargando = false;
      },
    });
  }

  private cargarAsistencias(cursoId: string): void {
    this.cargando = true;
    this.errorMsg = '';

    this.api.getAsistenciaPorCurso(cursoId as unknown as UUID).subscribe({
      next: (res: AsistenciaResponse[]) => {
        this.asistencias = res || [];
        this.cargando = false;
      },
      error: () => {
        this.errorMsg = 'Error cargando asistencias.';
        this.cargando = false;
      },
    });
  }

  // ============================================================
  // EDICIÓN INDIVIDUAL (ALUMNO + FECHA)
  // ============================================================

  // 👇 Clave única de cada asistencia
  private getAsistenciaKey(a: AsistenciaResponse): string {
    return `${a.auth0Id}-${this.formatearFechaISO(a.fecha as string)}`;
  }

  // Convierte DD/MM/YYYY → YYYY-MM-DD
  formatearFechaISO(fechaStr: string): string {
    const [dia, mes, anio] = fechaStr.split('/');
    return `${anio}-${mes}-${dia}`;
  }

  estaEditando(a: AsistenciaResponse): boolean {
    return this.asistenciasBackup.has(this.getAsistenciaKey(a));
  }

  editarAsistencia(a: AsistenciaResponse): void {
    const key = this.getAsistenciaKey(a);
    if (!this.asistenciasBackup.has(key)) {
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
      fecha: this.formatearFechaISO(a.fecha as string), // 👈 EXACTO como lo esperaba tu backend original
    };

    const key = this.getAsistenciaKey(a);
    this.asistenciasBackup.delete(key); // salir de edición optimista

    this.api
      .actualizarAsistenciaAlumno(String(a.cursoId), asistenciaActualizada)
      .subscribe({
        next: () => {
          console.log('Actualizada asistencia de:', a.auth0Id);
        },
        error: (err) => {
          console.error('Error actualizando asistencia:', a.auth0Id, err);
        },
      });
  }
}
