import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/core/service/api.service';
import { AsistenciaAlumnoDto, AsistenciaResponse } from 'src/core/models/asistencia';

interface AsistenciaMateria {
  nombre: string;
  //codigoCurso: string;
  //profesor: string;
  totalClases: number;
  asistencias: number;
  ausencias: number;
  porcentaje: number;
  estado: 'regular' | 'critico';
  detalles: DetalleAsistencia[];
}

interface DetalleAsistencia {
  fecha: string;
  estado: 'presente' | 'ausente' | 'tarde';
}

@Component({
  selector: 'app-historial-asistencia',
  templateUrl: './historial-asistencia.component.html',
  styleUrls: ['./historial-asistencia.component.scss']
})
export class HistorialAsistenciaComponent implements OnInit {

  materias: AsistenciaMateria[] = [];
  materiaExpandida: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.cargarMisAsistencias();
  }

  private cargarMisAsistencias(): void {
    this.apiService.getMisAsistencias().subscribe({
      next: (asistencias: AsistenciaResponse[]) => {
        const materiasAgrupadas: AsistenciaMateria[] = [];

        asistencias.forEach((asistencia) => {
          // Soporta tanto cursoNombre (TS) como nombreCurso (backend)
          const nombreCurso =
            (asistencia as any).nombreCurso ??
            'Sin nombre';

          // Busco si ya tengo una materia creada para este curso
          let materia = materiasAgrupadas.find(m => m.nombre === nombreCurso);

          // Si no existe, la creo
          if (!materia) {
            materia = {
              nombre: nombreCurso,
              totalClases: 0,
              asistencias: 0,
              ausencias: 0,
              porcentaje: 0,
              estado: 'regular',
              detalles: []
            };
            materiasAgrupadas.push(materia);
          }

          // Actualizo contadores
          materia.totalClases++;

          if (asistencia.presente) {
            materia.asistencias++;
          } else {
            materia.ausencias++;
          }

          // Agrego el detalle de esa clase
          materia.detalles.push({
            fecha: asistencia.fecha,
            estado: asistencia.presente ? 'presente' : 'ausente'
          });
        });

        // Calculo porcentaje y estado por materia
        this.materias = materiasAgrupadas.map(materia => {
          const porcentaje = materia.totalClases > 0
            ? +(materia.asistencias * 100 / materia.totalClases).toFixed(1)
            : 0;

          const estado: 'regular' | 'critico' =
            porcentaje >= 70 ? 'regular' : 'critico';

          return {
            ...materia,
            porcentaje,
            estado
          };
        });

        // Opcional: ordeno por nombre
        this.materias.sort((a, b) => a.nombre.localeCompare(b.nombre));

        // Para verificar en consola qué nombres están llegando
        console.log('Materias agrupadas:', this.materias);
      },
      error: (err) => {
        console.error('Error al cargar mis asistencias', err);
        this.materias = [];
      }
    });
  }

  toggleDetalle(nombreMateria: string): void {
    this.materiaExpandida =
      this.materiaExpandida === nombreMateria ? null : nombreMateria;
  }

  getEstadoIcon(estado: 'presente' | 'ausente' | 'tarde'): string {
    switch (estado) {
      case 'presente': return 'check_circle';
      case 'ausente': return 'cancel';
      default: return 'help';
    }
  }

  getEstadoColor(estado: 'presente' | 'ausente' | 'tarde'): string {
    switch (estado) {
      case 'presente': return 'estado-presente';
      case 'ausente': return 'estado-ausente';
      default: return '';
    }
  }

  getProgressBarColor(estado: 'regular' | 'critico'): string {
    switch (estado) {
      case 'regular': return 'primary';
      case 'critico': return 'warn';
      default: return 'primary';
    }
  }
}