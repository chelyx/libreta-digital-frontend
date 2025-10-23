import { Component, OnInit } from '@angular/core';
import { Curso } from 'src/core/models/curso';
import { User } from 'src/core/models/user';

import { ApiService } from 'src/core/service/api.service';

@Component({
selector: 'app-toma-de-asistencia',
templateUrl: './toma-de-asistencia.component.html',
styleUrls: ['./toma-de-asistencia.component.scss'],
})
export class TomaDeAsistenciaComponent implements OnInit {
  cursos: Curso[] = [];
  cursoSeleccionado?: Curso;
  filtro = '';
  asistencias: { [auth0Id: string]: boolean } = {};
  saving = false;

  constructor(private cursoService: ApiService) {}

  ngOnInit(): void {
    this.refrescar();
  }

  refrescar(): void {
    this.cursoService.getMisCursos().subscribe({
      next: (data) => (this.cursos = data),
      error: (err) => console.error('Error al cargar cursos', err)
    });
  }

  onCursoChange(curso: Curso | ''): void {
    if (curso === '') {
      this.cursoSeleccionado = undefined;
      this.asistencias = {};
      return;
    }
    this.cursoSeleccionado = curso;
    this.asistencias = {};
    curso.alumnos.forEach((alumno) => {
      this.asistencias[alumno.auth0Id] = false;
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
      presente
    }));

    console.log('Datos a enviar:', lista);

    // acá harías el POST al endpoint de asistencia (ejemplo)
    this.cursoService.saveAsistencia(this.cursoSeleccionado!.id,lista).subscribe({
      next: () => this.saving = false,
      error: (err) => { console.error(err); this.saving = false; }
    });

  }
}
