import { Component, OnInit } from '@angular/core';

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

// --------- DATOS DUMMY DE FINALES ----------
finalesEjemplo: Final[] = [
{
id: 'f1',
materia: 'Matemática',
codigoCurso: 'MAT-101',
// año, mes (0-based), día  -> febrero = 1
fecha: new Date(2025, 1, 15),
      hora: '09:00',
      aula: 'Aula 301',
      cantidadAlumnos: 25
    },
    {
      id: 'f2',
      materia: 'Física',
      codigoCurso: 'FIS-202',
      fecha: new Date(2025, 1, 15),
      hora: '14:00',
      aula: 'Aula 205',
      cantidadAlumnos: 30
    },
    {
      id: 'f3',
      materia: 'Programación',
      codigoCurso: 'PRO-300',
      fecha: new Date(2025, 1, 20),
      hora: '10:00',
      aula: 'Lab 1',
      cantidadAlumnos: 20
    },
    {
      id: 'f4',
      materia: 'Historia',
      codigoCurso: 'HIS-150',
      fecha: new Date(2025, 1, 22),
      hora: '16:00',
      aula: 'Aula 401',
      cantidadAlumnos: 28
    }
  ];

  // --------- DATOS DUMMY DE ALUMNOS ----------
  alumnosEjemplo: AlumnoNota[] = [
    { auth0Id: '1', nombre: 'Juan Pérez',        email: 'juan.perez@ejemplo.com',        ausente: false },
    { auth0Id: '2', nombre: 'María García',      email: 'maria.garcia@ejemplo.com',      ausente: false },
    { auth0Id: '3', nombre: 'Carlos López',      email: 'carlos.lopez@ejemplo.com',      ausente: false },
    { auth0Id: '4', nombre: 'Ana Martínez',      email: 'ana.martinez@ejemplo.com',      ausente: false },
    { auth0Id: '5', nombre: 'Pedro Rodríguez',   email: 'pedro.rodriguez@ejemplo.com',   ausente: false }
  ];

  ngOnInit(): void {
    this.finales = this.finalesEjemplo;
  }

  // ---------- CAMBIO DE FECHA ----------
  // llamado desde (dateChange)="onFechaChange()"
  onFechaChange(): void {
    if (!this.fechaSeleccionada) {
      this.finalesFiltrados = [];
      this.finalSeleccionado = null;
      this.alumnos = [];
      return;
    }

    const fBusq = this.fechaSeleccionada;

    this.finalesFiltrados = this.finales.filter(f => {
      const d = f.fecha;
      return (
        d.getFullYear() === fBusq.getFullYear() &&
        d.getMonth() === fBusq.getMonth() &&
        d.getDate() === fBusq.getDate()
      );
    });

    this.finalSeleccionado = null;
    this.alumnos = [];
  }

  // ---------- SELECCIONAR UN FINAL ----------
  // llamado desde (click)="seleccionarFinal(final)" en la card
  seleccionarFinal(final: Final): void {
    this.finalSeleccionado = final;
    // clonamos el array de ejemplo para no mutarlo
    this.alumnos = JSON.parse(JSON.stringify(this.alumnosEjemplo));
  }

  // ---------- MARCAR AUSENTE / PRESENTE ----------
  // llamado desde (click)="marcarAusente(alumno, true|false)"
  marcarAusente(alumno: AlumnoNota, ausente: boolean): void {
    alumno.ausente = ausente;
    if (ausente) {
      alumno.nota = null;
    }
  }

  // ---------- CAMBIO DE NOTA ----------
  // llamado desde (input)="onNotaChange(alumno, $any($event.target).value)"
  onNotaChange(alumno: AlumnoNota, valor: string): void {
    const nota = parseFloat(valor);
    if (!isNaN(nota) && nota >= 0 && nota <= 10) {
      alumno.nota = nota;
      alumno.ausente = false;
    }
  }

  // ---------- GUARDAR NOTAS ----------
  // llamado desde (click)="guardarNotas()"
  guardarNotas(): void {
    if (!this.finalSeleccionado) {
      return;
    }

    this.saving = true;

    // Acá iría la llamada real al backend
    console.log('Guardando notas del final:', this.finalSeleccionado.id, {
      notas: this.alumnos.map(a => ({
        auth0Id: a.auth0Id,
        nota: a.ausente ? null : a.nota,
        ausente: a.ausente
      }))
    });

    setTimeout(() => {
      this.saving = false;
      alert('Notas guardadas correctamente (dummy)');
    }, 1000);
  }

  limpiarFecha(): void {
    this.fechaSeleccionada = null;
    this.finalesFiltrados = [];
    this.finalSeleccionado = null;
    this.alumnos = [];
  }

  trackByAuth0Id(index: number, alumno: AlumnoNota): string {
    return alumno.auth0Id;
  }
}
