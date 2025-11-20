import { Component, OnInit } from '@angular/core';

interface AsistenciaMateria {
nombre: string;
codigoCurso: string;  // <-- AGREGADO
profesor: string;
totalClases: number;
asistencias: number;
ausencias: number;
porcentaje: number;
estado: 'regular' | 'critico';
detalles: DetalleAsistencia[];
}

interface DetalleAsistencia {
fecha: Date;
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

ngOnInit() {
    this.materias = [
      {
        nombre: 'Matemática Discreta',
        codigoCurso: 'K5612',  // <-- AGREGADO
        profesor: 'Prof. García',
        totalClases: 20,
        asistencias: 18,
        ausencias: 2,
        porcentaje: 90,
        estado: 'regular',
        detalles: [
          { fecha: new Date('2025-01-15'), estado: 'presente' },
          { fecha: new Date('2025-01-22'), estado: 'presente' },
          { fecha: new Date('2025-01-29'), estado: 'ausente' },
          { fecha: new Date('2025-02-05'), estado: 'presente' }
        ]
      },
      {
        nombre: 'Física I',
        codigoCurso: 'K9456',  // <-- AGREGADO
        profesor: 'Prof. Rodríguez',
        totalClases: 18,
        asistencias: 16,
        ausencias: 2,
        porcentaje: 88.9,
        estado: 'regular',
        detalles: [
          { fecha: new Date('2025-01-16'), estado: 'presente' },
          { fecha: new Date('2025-01-23'), estado: 'presente' },
          { fecha: new Date('2025-01-30'), estado: 'presente' }
        ]
      },
      {
        nombre: 'Programación',
        codigoCurso: 'K8945',  // <-- AGREGADO
        profesor: 'Prof. Martínez',
        totalClases: 22,
        asistencias: 15,
        ausencias: 7,
        porcentaje: 68.2,
        estado: 'critico',
        detalles: [
          { fecha: new Date('2025-01-17'), estado: 'presente' },
          { fecha: new Date('2025-01-24'), estado: 'ausente' },
          { fecha: new Date('2025-01-31'), estado: 'ausente' },
          { fecha: new Date('2025-02-07'), estado: 'presente' }
        ]
      },
      {
        nombre: 'Redes de Datos',
        codigoCurso: 'K7894',  // <-- AGREGADO
        profesor: 'Prof. Echazu',
        totalClases: 15,
        asistencias: 12,
        ausencias: 3,
        porcentaje: 80,
        estado: 'regular',
        detalles: [
          { fecha: new Date('2025-01-18'), estado: 'presente' },
          { fecha: new Date('2025-01-25'), estado: 'ausente' },
          { fecha: new Date('2025-02-01'), estado: 'presente' }
        ]
      }
    ];
  }

  toggleDetalle(nombreMateria: string) {
    this.materiaExpandida = this.materiaExpandida === nombreMateria ? null : nombreMateria;
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
