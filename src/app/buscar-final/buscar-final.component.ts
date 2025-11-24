import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/core/service/api.service';

interface Final {
  id: string;
  materia: string;
  codigoCurso: string;
  fecha: Date;
  hora: string;
  aula: string;
  cantidadAlumnos: number;
}

interface AlumnoNota {
  auth0Id: string;
  nombre: string;
  email: string;
  nota?: number | null;
  ausente: boolean;
}

@Component({
  selector: 'app-buscar-final',
  templateUrl: './buscar-final.component.html',
  styleUrls: ['./buscar-final.component.scss']
})
export class BuscarFinalComponent implements OnInit {

  fechaSeleccionada: Date | null = null;
  finales: Final[] = [];
  finalesFiltrados: Final[] = [];
  finalSeleccionado: Final | null = null;
  alumnos: AlumnoNota[] = [];
  saving = false;

  cursosPorFecha: any[] = [];

  finalesEjemplo: Final[] = [];
  alumnosEjemplo: AlumnoNota[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.finales = this.finalesEjemplo;
  }

  onFechaChange(): void {
    if (!this.fechaSeleccionada) {
      this.finalesFiltrados = [];
      this.finalSeleccionado = null;
      this.alumnos = [];
      this.cursosPorFecha = [];
      return;
    }

    const d = this.fechaSeleccionada;
    const dia = d.getDate().toString().padStart(2, '0');
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const anio = d.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    this.finalesFiltrados = [];
    this.finalSeleccionado = null;
    this.alumnos = [];
    this.cursosPorFecha = [];

    this.apiService.getCursoByFecha(fechaFormateada).subscribe({
      next: (cursos: any[]) => {
        this.cursosPorFecha = cursos || [];
        this.finalesFiltrados = this.cursosPorFecha.map(curso =>
          this.mapCursoToFinal(curso)
        );
      },
      error: (err) => {
        console.error('Error al obtener cursos por fecha', err);
        this.finalesFiltrados = [];
        this.cursosPorFecha = [];
      }
    });
  }

  private mapCursoToFinal(curso: any): Final {
    return {
      id: curso.id || curso.cursoId || '',
      materia: curso.nombre || curso.materia || curso.nombreCurso || 'Sin nombre',
      codigoCurso: curso.codigo || curso.codigoCurso || '',
      fecha: curso.fecha ? new Date(curso.fecha) : (this.fechaSeleccionada ?? new Date()),
      hora: curso.hora || '',
      aula: curso.aula || '',
      cantidadAlumnos: curso.cantidadAlumnos ??
        (Array.isArray(curso.alumnos) ? curso.alumnos.length : 0)
    };
  }

  seleccionarFinal(final: Final): void {
    this.finalSeleccionado = final;

    const cursoSeleccionado = this.cursosPorFecha.find((curso: any) =>
      (curso.id || curso.cursoId || '') === final.id
    );

    if (cursoSeleccionado && Array.isArray(cursoSeleccionado.alumnos)) {
      this.alumnos = cursoSeleccionado.alumnos.map((alumno: any) => ({
        auth0Id: alumno.auth0Id || alumno.id || alumno.alumnoId || '',
        nombre:
          alumno.nombre ||
          alumno.nombreCompleto ||
          `${alumno.apellido ?? ''} ${alumno.nombre ?? ''}`.trim() ||
          'Sin nombre',
        email: alumno.email || alumno.correo || '',
        nota: alumno.nota,
        ausente: false
      }));

      // ✅ ORDEN ALFABÉTICO POR NOMBRE
      this.alumnos.sort((a, b) =>
        a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
      );

    } else {
      console.warn('Curso sin lista de alumnos, usando alumnosEjemplo como fallback');
      this.alumnos = JSON.parse(JSON.stringify(this.alumnosEjemplo));
    }
  }

  marcarAusente(alumno: AlumnoNota, ausente: boolean): void {
    alumno.ausente = ausente;
    if (ausente) {
      alumno.nota = null;
    }
  }

  onNotaChange(alumno: AlumnoNota, valor: string): void {
    const nota = parseFloat(valor);
    if (!isNaN(nota) && nota >= 0 && nota <= 10) {
      alumno.nota = nota;
      alumno.ausente = false;
    }
  }

  guardarNotas(): void {
    if (!this.finalSeleccionado) {
      return;
    }

    this.saving = true;

    const notasPayload = this.alumnos.map(a => ({
      alumnoId: a.auth0Id,
      descripcion: '',
      valor: a.ausente ? null : (a.nota ?? null),
      ausente: a.ausente
    })) as any;

    this.apiService.saveNotas(
      this.finalSeleccionado.id as any,
      notasPayload
    ).subscribe({
      next: () => {
        this.saving = false;
        alert('Notas guardadas correctamente');
      },
      error: (err) => {
        console.error('Error al guardar las notas', err);
        this.saving = false;
        alert('Ocurrió un error al guardar las notas');
      }
    });
  }

  limpiarFecha(): void {
    this.fechaSeleccionada = null;
    this.finalesFiltrados = [];
    this.finalSeleccionado = null;
    this.alumnos = [];
    this.cursosPorFecha = [];
  }

  trackByAuth0Id(index: number, alumno: AlumnoNota): string {
    return alumno.auth0Id;
  }
}
