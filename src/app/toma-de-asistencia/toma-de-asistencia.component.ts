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
filtro = '';
// <CHANGE> Agregar campo para búsqueda por ID/codigo de curso
cursoIdBusqueda = '';
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
    // <CHANGE> Limpiar búsqueda por ID/codigo cuando se selecciona del dropdown
    this.cursoIdBusqueda = '';
    this.cursoSeleccionado = curso;
    this.asistencias = {};
    curso.alumnos.forEach((alumno) => {
      this.asistencias[alumno.auth0Id] = false;
    });
  }

  // <CHANGE> Nueva función para buscar curso por ID/codigo
  onBuscarPorId(): void {
    if (this.cursoIdBusqueda.trim()) {
      // Limpiar selección del dropdown
      this.cursoSeleccionado = undefined;

      // Buscar el curso por ID/codigo
      const cursoEncontrado = this.cursos.find(c =>
        c.id.toString().toLowerCase() === this.cursoIdBusqueda.toLowerCase() ||
        c.nombre.toLowerCase().includes(this.cursoIdBusqueda.toLowerCase())
      );

      if (cursoEncontrado) {
        console.log('[v0] Curso encontrado por código:', cursoEncontrado);
        this.onCursoChange(cursoEncontrado);
      } else {
        console.log('[v0] No se encontró curso con ese código:', this.cursoIdBusqueda);
        this.snackBar.open('No se encontró un curso con ese código', '', { duration: 3000 });
      }
    }
  }

  get alumnosFiltrados(): User[] {
    if (!this.cursoSeleccionado) return [];
    const alumnos = this.cursoSeleccionado.alumnos || [];
    if (!this.filtro) return alumnos;
    return alumnos.filter(a =>
      (a.nombre + a.email).toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  trackByAuth0Id(_: number, alumno: User): string {
    return alumno.auth0Id;
  }

  guardarAsistencia(): void {
    if (!this.cursoSeleccionado) return;

    this.saving = true;
    const lista = Object.entries(this.asistencias).map(([auth0Id, presente]) => ({
      alumnoId: auth0Id,
      presente,
      fecha: new Date()
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
