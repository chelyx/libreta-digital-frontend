import { Component, Input } from '@angular/core';
import { UUID } from 'crypto';
import { Curso } from 'src/core/models/curso';
import { NotaDto, NotaResponse } from 'src/core/models/notas';
import { ApiService } from 'src/core/service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
selector: 'app-notas-table',
templateUrl: './notas-table.component.html',
styleUrls: ['./notas-table.component.scss']
})
export class NotasTableComponent {
@Input() cursos: Curso[] = [];

// --- existentes (no tocar) ---
cursoSeleccionado: UUID = '' as UUID;
notas: NotaResponse[] = [];
notasFiltradas: NotaResponse[] = [];
busquedaNombreAlumno: string = '';
busquedaFecha: string = '';

// === NUEVO: campos para buscar por código + fecha ===
codigoCurso: string = '';
fechaCurso: string = '';
buscando: boolean = false;

// === NUEVO: método que llama al servicio getByCodigoYFecha ===
buscarCurso(): void {
  const codigo = (this.codigoCurso || '').trim();
  const fecha = (this.fechaCurso || '').trim();

  if (!codigo || !fecha) {
    return;
  }

  this.buscando = true;
  this.apiService.getByCodigoYFecha(codigo, fecha).subscribe({
    next: (curso: Curso) => {
      this.buscando = false;
      // Si encontró el curso, lo seleccionamos y cargamos los datos como si el usuario lo hubiese elegido.
      if (curso?.id) {
        this.cursoSeleccionado = curso.id as unknown as UUID;
        this.onCursoChange(curso.id);
      }
    },
    error: () => {
      this.buscando = false;
      // Podrías mostrar un snackbar si quieres feedback de error:
      // this.snackBar.open('No se encontró un curso con ese código y fecha', 'OK', { duration: 2500 });
    }
  });
}

// --- existentes (no tocar) ---
constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

onCursoChange(cursoId: string): void {
  if (!cursoId) {
    this.notas = [];
    this.notasFiltradas = [];
    return;
  }
  this.apiService.getNotasByCurso(cursoId as UUID).subscribe({
    next: (res) => {
      this.notas = res || [];
      this.aplicarFiltros();
    },
    error: (err) => {
      console.error('Error al cargar notas del curso', err);
    }
  });
}

limpiarBusqueda(): void {
  this.busquedaNombreAlumno = '';
  this.busquedaFecha = '';
  this.aplicarFiltros();
}

aplicarFiltros(): void {
  let resultado = [...this.notas];

  if (this.busquedaNombreAlumno || this.busquedaFecha) {
    resultado = resultado.filter((nota) => {
      const coincideNombre = !this.busquedaNombreAlumno ||
        (nota.alumnoNombre && nota.alumnoNombre.toLowerCase().includes(this.busquedaNombreAlumno.toLowerCase()));

      const coincideFecha = !this.busquedaFecha ||
        (nota.fecha && this.formatearFecha(nota.fecha) === this.busquedaFecha); // asumiendo 'YYYY-MM-DD'
      return coincideNombre && coincideFecha;
    });
  }

  this.notasFiltradas = resultado;
}

formatearFecha(fecha: Date | string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  guardarNotas() {
    let notas: NotaDto[] = this.notas
      .map(a => ({
        id: a.id,
        valor: a.valor
      }));
    let notasBulkDto = {
      cursoId: this.cursoSeleccionado,
      notas: notas
    }
    this.apiService.updateNotas(notasBulkDto)
      .subscribe({
        next: (res) => {
          console.log('Notas guardadas correctamente', res);
          this.snackBar.open('✓ Notas cargadas exitosamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
        },
        error: (err) => {
          console.error('Error guardando notas', err);
        }
      });
  }

hayCambios(): boolean {
  return this.notas.some(n => n.valor !== null && n.valor !== undefined && n.valor !== 0);
}

getCambiosCount(): number {
  return this.notas.filter(n => n.valor !== null && n.valor !== undefined && n.valor !== 0).length;
}
}
