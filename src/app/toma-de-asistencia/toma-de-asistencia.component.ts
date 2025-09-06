import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService as AppAuth } from '../../core/services/auth.service';

interface Curso { id: string; nombre: string; }

interface Alumno {
  nombre: string;
  apellido: string;
  dni: string;
  presente: boolean;
  cursoId: string[];
}

@Component({
  selector: 'app-toma-de-asistencia',
  templateUrl: './toma-de-asistencia.component.html',
  styleUrls: ['./toma-de-asistencia.component.scss'],
})
export class TomaDeAsistenciaComponent implements OnInit, OnDestroy {
  private sub?: Subscription;

  filtro = '';
  saving = false;

  // 🔁 Copia inmutable de TODOS los cursos
  private allCursos: Curso[] = [
    { id: '1A', nombre: 'Redes de información' },
    { id: '2B', nombre: 'Técnicas Avanzadas de Programación' },
    { id: '3C', nombre: 'Proyecto Final' },
    { id: '4C', nombre: 'Neurociencia' },
    { id: '5C', nombre: 'Laboratorio Física 1' },
    { id: '6C', nombre: 'Sistemas de Gestión' },
  ];

  // 👇 Lista visible (se filtra según rol)
  cursos: Curso[] = [...this.allCursos];
  cursoSeleccionado: string = ''; // '' = Todos (solo Admin)

  alumnos: Alumno[] = [
    { nombre: 'Ezequiel', apellido: 'Castiglione',  dni: '43234567', presente: false, cursoId: ['4C','3C'] },
    { nombre: 'Maximiliano', apellido: 'De la Fuente',  dni: '44244668', presente: false, cursoId: ['3C'] },
    { nombre: 'Yasmin', apellido: 'Elias',  dni: '54345678', presente: false, cursoId: ['2B','3C'] },
    { nombre: 'Ana',     apellido: 'García', dni: '30111222', presente: false, cursoId: ['1A'] },
    { nombre: 'Luis',    apellido: 'Pérez',  dni: '28999888', presente: true,  cursoId: ['2B'] },
    { nombre: 'Cecilia', apellido: 'Rocca',  dni: '32123456', presente: false, cursoId: ['1A','3C','2B'] },
    { nombre: 'Araceli', apellido: 'Soffulto',  dni: '33133557', presente: true, cursoId: ['2B'] },
  ];

  constructor(private snack: MatSnackBar, private appAuth: AppAuth) {}

  // ✅ helpers de rol para usar en TS/HTML
  get isAdmin(): boolean   { return this.appAuth.hasRole('BEDEL'); }
  get isProfesor(): boolean { return this.appAuth.hasRole('PROFESOR') ; }

  ngOnInit(): void {
    // 🔔 REACTIVO: cada cambio de usuario/roles vuelve a filtrar
    this.sub = this.appAuth.user$.subscribe(() => this.aplicarFiltroPorRol());
    // y una vez de arranque
    this.aplicarFiltroPorRol();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private aplicarFiltroPorRol(): void {
    // reset a todos
    this.cursos = [...this.allCursos];

    // Si es PROFESOR (y no Admin), filtrar por allowedCourseIds
    if (this.isProfesor) {
      const permitidos = this.appAuth.user?.allowedCourseIds ?? [];
      this.cursos = this.cursos.filter(c => permitidos.includes(c.id));

      // Selección coherente
      if (this.cursos.length === 1) {
        this.cursoSeleccionado = this.cursos[0].id;
      } else if (this.cursos.length > 1) {
        if (!this.cursoSeleccionado || !permitidos.includes(this.cursoSeleccionado)) {
          this.cursoSeleccionado = this.cursos[0].id;
        }
      } else {
        // Sin cursos permitidos
        this.cursoSeleccionado = '';
      }

      // Debug útil:
      console.log('Cursos permitidos:', permitidos, 'Cursos visibles:', this.cursos);
    }
    // Admin: ve todos, cursoSeleccionado queda como esté ('' = Todos válido solo para Admin)
  }

  get alumnosFiltrados(): Alumno[] {
    const q = this.filtro?.toLowerCase().trim() || '';
    return this.alumnos.filter(a => {
      const coincideCurso = !this.cursoSeleccionado || a.cursoId.includes(this.cursoSeleccionado);
      const coincideTexto = !q || `${a.apellido} ${a.nombre} ${a.dni}`.toLowerCase().includes(q);
      return coincideCurso && coincideTexto;
    });
  }

  trackByDni = (_: number, a: Alumno) => a.dni;

  onCursoChange(id: string) {
    // ⛑️ PROFESOR: no permitir 'Todos' ('') ni cursos no asignados
    if (this.isProfesor) {
      if (!id) return; // evita 'Todos'
      const permitidos = this.appAuth.user?.allowedCourseIds ?? [];
      if (!permitidos.includes(id)) return;
    }
    this.cursoSeleccionado = id;
  }

  marcar(_a: Alumno) {}

  guardar(): void {
    const payload = {
      fecha: new Date().toISOString().slice(0, 10),
      cursoId: this.cursoSeleccionado || null,
      items: this.alumnosFiltrados.map(a => ({ dni: a.dni, presente: a.presente })),
      ts: new Date().toISOString(),
    };

    this.saving = true;
    setTimeout(() => {
      try {
        const key = 'asistencia_historial';
        const hist = JSON.parse(localStorage.getItem(key) || '[]');
        hist.push(payload);
        localStorage.setItem(key, JSON.stringify(hist));
        this.snack.open('Asistencia guardada (local) ', 'OK', { duration: 2500 });
      } catch (e) {
        console.error('Error guardando', e);
        this.snack.open('Error al guardar ', 'Cerrar', { duration: 3500 });
      } finally {
        this.saving = false;
      }
    }, 800);
  }

  cancelar(): void {
    this.filtro = '';
  }

  refrescar(): void {
    this.filtro = '';
    this.cursoSeleccionado = '';
    this.alumnos = this.alumnos.map(a => ({ ...a, presente: false }));
    this.snack.open('Lista actualizada', 'OK', { duration: 1800 });
  }
}
