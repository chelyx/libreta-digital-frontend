import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Curso } from 'src/core/models/curso';
import { User } from 'src/core/models/user';
import { ApiService } from 'src/core/service/api.service';

@Component({
selector: 'app-toma-de-asistencia',
templateUrl: './toma-de-asistencia.component.html',
styleUrls: ['./toma-de-asistencia.component.scss'],
})
export class TomaDeAsistenciaComponent implements OnInit {

@Input() cursos: Curso[] = [];

cursoSeleccionado?: Curso;

/** Lista visible para el HTML */
alumnos: User[] = [];

/** Estado de cada alumno */
asistencias: { [auth0Id: string]: boolean } = {};

saving = false;

constructor(
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  refrescar(): void {
    this.onCursoChange('');
  }

  /** Maneja el cambio de curso desde el buscador */
  onCursoChange(curso: Curso | ''): void {
    if (curso === '') {
      this.cursoSeleccionado = undefined;
      this.alumnos = [];
      this.asistencias = {};
      return;
    }

    this.cursoSeleccionado = curso;

    // Ordenar alumnos alfabéticamente
    this.alumnos = [...curso.alumnos].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );

    // Inicializar asistencias: por defecto todos presentes
    this.asistencias = {};
    this.alumnos.forEach(alumno => {
      this.asistencias[alumno.auth0Id] = true;
    });

    // Cargar asistencias previas desde la API
    this.api.getAsistenciaPorCurso(curso.id).subscribe(data => {
      data.forEach(item => {
        this.asistencias[item.auth0Id] = item.presente;
      });
    });
  }

  /** trackBy del HTML */
  trackByAuth0Id(index: number, alumno: User): string {
    return alumno.auth0Id;
  }

  /** Guardar asistencias del curso */
  guardarAsistencia(): void {
    if (!this.cursoSeleccionado) return;

    this.saving = true;

    // fecha obligatoria (lo pide tu ApiService)
    const ahoraUTC3 = () => {
      const d = new Date();
      d.setHours(d.getHours() - 3);
      return d;
    };

    const lista = Object.entries(this.asistencias).map(([auth0Id, presente]) => ({
      alumnoId: auth0Id,
      presente,
      fecha: ahoraUTC3()
    }));

    this.api
      .saveAsistencia(this.cursoSeleccionado.id, lista)
      .subscribe({
        next: (res: any) => {
          this.saving = false;

          // respuesta offline del interceptor
          if (res === null) {
            this.snackBar.open(
              '📡 Guardado sin conexión. Se sincronizará automáticamente.',
              'Cerrar',
              {
                duration: 3500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['info-snackbar'],
              }
            );
            return;
          }

          // respuesta normal (online)
          this.snackBar.open(
            '✔ Asistencia guardada con éxito',
            'Cerrar',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar'],
            }
          );
        },

        error: (err: any) => {
          this.saving = false;

          this.snackBar.open(
            '❌ Error al guardar asistencia.',
            'Cerrar',
            {
              duration: 3500,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            }
          );
        }
      });
  }
}
