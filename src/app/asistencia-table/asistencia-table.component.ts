import { Component, OnInit, Input } from '@angular/core'; // <-- Agrega Input aquí
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
// <CHANGE> Agregar decorador @Input() para recibir cursos del componente padre
@Input() cursos: Curso[] = [];  // <-- Esta es la línea clave que falta

cursoSeleccionado: string = '';
cursoIdBusqueda: string = '';

  // Datos
  asistencias: AsistenciaResponse[] = [];

    // UI
  cargando = false;
  errorMsg = '';
  
  constructor(private api: ApiService) {}

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
        // si además querés reflejar la selección actual en algún select:
        this.cursoSeleccionado = String(cursoId);

        // Paso 2: cargar asistencias del curso encontrado
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

  /**
   * Método auxiliar (si lo necesitás en el template)
   */
  hayAsistencias(): boolean {
    return Array.isArray(this.asistencias) && this.asistencias.length > 0;
  }

  buscarCurso(): void {
    const cursoId = this.cursoSeleccionado || this.cursoIdBusqueda;

    if (cursoId) {
      console.log('[v0] Buscando curso con ID:', cursoId);
      // Aquí va tu lógica de navegación
    } else {
      console.warn('No se ha seleccionado ningún curso');
    }
  }
}
