import { Component, OnInit } from '@angular/core';

interface AsistenciaMateria {
nombre: string;
profesor: string;
totalClases: number;
asistencias: number;
ausencias: number;
porcentaje: number;
estado: 'regular' | 'alerta' | 'critico';
detalles: DetalleAsistencia[];
}

interface DetalleAsistencia {
fecha: Date;
estado: 'presente' | 'ausente' | 'tarde';
tema: string;
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
        nombre: 'Matemática',
        profesor: 'Prof. García',
        totalClases: 20,
        asistencias: 18,
        ausencias: 2,
        porcentaje: 90,
        estado: 'regular',
        detalles: [
          { fecha: new Date('2025-01-15'), estado: 'presente', tema: 'Álgebra lineal' },
          { fecha: new Date('2025-01-22'), estado: 'presente', tema: 'Derivadas' },
          { fecha: new Date('2025-01-29'), estado: 'ausente', tema: 'Integrales' },
          { fecha: new Date('2025-02-05'), estado: 'presente', tema: 'Ecuaciones diferenciales' }
        ]
      },
      {
        nombre: 'Física',
        profesor: 'Prof. Rodríguez',
        totalClases: 18,
        asistencias: 16,
        ausencias: 2,
        porcentaje: 88.9,
        estado: 'regular',
        detalles: [
          { fecha: new Date('2025-01-16'), estado: 'presente', tema: 'Mecánica clásica' },
          { fecha: new Date('2025-01-23'), estado: 'presente', tema: 'Cinemática' },
          { fecha: new Date('2025-01-30'), estado: 'presente', tema: 'Dinámica' }
        ]
      },
      {
        nombre: 'Programación',
        profesor: 'Prof. Martínez',
        totalClases: 22,
        asistencias: 15,
        ausencias: 7,
        porcentaje: 68.2,
        estado: 'critico',
        detalles: [
          { fecha: new Date('2025-01-17'), estado: 'presente', tema: 'Angular básico' },
          { fecha: new Date('2025-01-24'), estado: 'ausente', tema: 'Componentes' },
          { fecha: new Date('2025-01-31'), estado: 'ausente', tema: 'Servicios' },
          { fecha: new Date('2025-02-07'), estado: 'presente', tema: 'Routing' }
        ]
      },
      {
        nombre: 'Historia',
        profesor: 'Prof. López',
        totalClases: 15,
        asistencias: 12,
        ausencias: 3,
        porcentaje: 80,
        estado: 'alerta',
        detalles: [
          { fecha: new Date('2025-01-18'), estado: 'presente', tema: 'Revolución Industrial' },
          { fecha: new Date('2025-01-25'), estado: 'ausente', tema: 'Primera Guerra Mundial' },
          { fecha: new Date('2025-02-01'), estado: 'presente', tema: 'Segunda Guerra Mundial' }
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
      case 'tarde': return 'schedule';
      default: return 'help';
    }
  }

  getEstadoColor(estado: 'presente' | 'ausente' | 'tarde'): string {
    switch (estado) {
      case 'presente': return 'estado-presente';
      case 'ausente': return 'estado-ausente';
      case 'tarde': return 'estado-tarde';
      default: return '';
    }
  }

  getProgressBarColor(estado: 'regular' | 'alerta' | 'critico'): string {
    switch (estado) {
      case 'regular': return 'primary';
      case 'alerta': return 'accent';
      case 'critico': return 'warn';
      default: return 'primary';
    }
  }
}
