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

  const local = this.cursos.find(c => c.codigo?.toLowerCase() === codigo.toLowerCase());
  if (local) {
    this.onCursoChange(local);
    //this.snackBar.open(`Curso encontrado localmente: ${local.nombre}`, '', { duration: 2500 });
    return;
  }

  // Si no está localmente, intentar buscar en backend
  const safe = encodeURIComponent(codigo);
  this.cursoService.getProtegido(`api/cursos/codigo/${safe}`).subscribe({
    next: (curso: any) => {
      this.onCursoChange(curso);
      this.snackBar.open(`Curso encontrado desde servidor: ${curso.nombre || curso.codigo}`, '', { duration: 2500 });
    },
    error: () => {
      this.snackBar.open('No se encontró un curso con ese código', '', { duration: 3000 });
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
