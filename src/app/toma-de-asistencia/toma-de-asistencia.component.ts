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
    this.cursoIdBusqueda = '';
    this.cursoSeleccionado = curso;
    this.asistencias = {};
    curso.alumnos.forEach((alumno) => {
      this.asistencias[alumno.auth0Id] = false;
    });
  }

  onBuscarPorId(): void {
    const codigo = (this.cursoIdBusqueda || '').trim();
    if (!codigo) {
      this.snackBar.open('Ingresá un código de curso', '', { duration: 3000 });
      return;
    }

    if (typeof (this as any).cargando !== 'undefined') (this as any).cargando = true;
    if (typeof (this as any).loading !== 'undefined') (this as any).loading = true;

    this.cursoSeleccionado = undefined;
    this.asistencias = {};

    const safe = encodeURIComponent(codigo);
    this.cursoService.getProtegido(`api/cursos/codigo/${safe}`).subscribe({
      next: (curso: any) => {
        this.onCursoChange(curso);

        if (typeof (this as any).cargando !== 'undefined') (this as any).cargando = false;
        if (typeof (this as any).loading !== 'undefined') (this as any).loading = false;

        this.snackBar.open(`Curso encontrado: ${curso?.nombre || curso?.codigo || codigo}`, '', { duration: 2500 });
      },
      error: (err) => {
        console.error('[onBuscarPorId] error:', err);
        if (typeof (this as any).cargando !== 'undefined') (this as any).cargando = false;
        if (typeof (this as any).loading !== 'undefined') (this as any).loading = false;

        const msg = err?.status === 404
          ? 'No se encontró un curso con ese código'
          : 'Ocurrió un error buscando el curso';
        this.snackBar.open(msg, '', { duration: 3000 });
      }
    });
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
