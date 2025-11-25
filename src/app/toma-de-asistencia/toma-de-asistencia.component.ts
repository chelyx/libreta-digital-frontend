import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Curso } from 'src/core/models/curso';
import { User } from 'src/core/models/user';
import { ApiService } from 'src/core/service/api.service';
import { HttpResponse } from '@angular/common/http';

@Component({
selector: 'app-toma-de-asistencia',
templateUrl: './toma-de-asistencia.component.html',
styleUrls: ['./toma-de-asistencia.component.scss'],
})
export class TomaDeAsistenciaComponent implements OnInit {
@Input() cursos: Curso[] = [];

cursoSeleccionado?: Curso;

alumnos: User[] = [];

asistencias: { [auth0Id: string]: boolean } = {};

saving = false;

constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  refrescar(): void {
    this.onCursoChange('');
  }

  onCursoChange(curso: Curso | ''): void {
    if (curso === '') {
      this.cursoSeleccionado = undefined;
      this.alumnos = [];
      this.asistencias = {};
      return;
    }

    this.cursoSeleccionado = curso;

    this.alumnos = [...curso.alumnos].sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );

    this.asistencias = {};
    this.alumnos.forEach(alumno => {
      this.asistencias[alumno.auth0Id] = true;
    });

    this.api.getAsistenciaPorCurso(curso.id).subscribe(data => {
      data.forEach(item => {
        this.asistencias[item.auth0Id] = item.presente;
      });
    });
  }

  trackByAuth0Id(index: number, alumno: User): string {
    return alumno.auth0Id;
  }

  guardarAsistencia(): void {
    if (!this.cursoSeleccionado) return;

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

    this.saving = true;

    this.api
      .saveAsistencia(this.cursoSeleccionado.id, lista)
      .subscribe({
        next: (res: any) => {
          this.saving = false;

          // ---------------------------------------------------
          // 🔥 DETECCIÓN REAL DE RESPUESTA OFFLINE DEL INTERCEPTOR
          // El interceptor devuelve: HttpResponse { status: 200, body: null }
          // ---------------------------------------------------
          const esOffline =
            res instanceof HttpResponse &&
            res.body === null &&
            res.status === 200;

          if (esOffline) {
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

          // --------------------------------------
          // 🟢 GUARDADO ONLINE NORMAL
          // --------------------------------------
          this.snackBar.open('✔ Asistencia guardada con éxito', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
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
