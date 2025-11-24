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
  asistencias: { [auth0Id: string]: boolean } = {};
  saving = false;

  constructor(private cursoService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
  }

  refrescar(): void {
    this.onCursoChange('')
  }

 onCursoChange(curso: Curso | ''): void {
   if (curso === '') {
     this.cursoSeleccionado = undefined;
     this.asistencias = {};
     return;
   }

   this.cursoSeleccionado = curso;
   this.asistencias = {};

   // ✅ Ordenar alumnos alfabéticamente por nombre
   this.cursoSeleccionado.alumnos = [...curso.alumnos].sort((a, b) =>
     a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
   );

   // Inicializar asistencias como presentes
   this.cursoSeleccionado.alumnos.forEach((alumno) => {
     this.asistencias[alumno.auth0Id] = true;
   });
 }


  get alumnos(): User[] {
    if (!this.cursoSeleccionado) return [];
    return this.cursoSeleccionado.alumnos || [];
  }

  trackByAuth0Id(_: number, alumno: User): string {
    return alumno.auth0Id;
  }

  guardarAsistencia(): void {
    if (!this.cursoSeleccionado) return;

    this.saving = true;

  function ahoraUTC3(): Date {
    const ahoraUTC = new Date();
  // UTC-3 significa restar 3 horas
    ahoraUTC.setHours(ahoraUTC.getHours() - 3);
  return ahoraUTC;
}

    const lista = Object.entries(this.asistencias).map(([auth0Id, presente]) => ({
      alumnoId: auth0Id,
      presente,
      fecha: ahoraUTC3()
    }));

    console.log('Datos a enviar:', lista);

    this.cursoService.saveAsistencia(this.cursoSeleccionado!.id, lista).subscribe({
      next: (res: any) =>{
        this.saving = false
        this.snackBar.open(res.status, '',{ duration: 3000 });
        this.refrescar();
      },
      error: (err) => { console.error(err); this.saving = false; }
    });
  }
}
