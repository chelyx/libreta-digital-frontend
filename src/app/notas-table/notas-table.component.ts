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

cursoSeleccionado: UUID = '' as UUID;
notas: NotaResponse[] = [];
notasFiltradas: NotaResponse[] = [];

busquedaNombreAlumno = '';
busquedaFecha = '';

constructor(private apiService: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  onCursoChange(cursoId: UUID) {
    this.cursoSeleccionado = cursoId;
    this.cargarAlumnosConNotas(cursoId);
  }

  cargarAlumnosConNotas(cursoId: string) {
    this.apiService.getNotasByCurso(cursoId as UUID).subscribe({
      next: (notasData) => {
        this.notas = notasData;
        this.aplicarFiltros();
      },
      error: (err) => {
        console.error('Error cargando notas', err);
      }
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.notas];

    if (this.busquedaNombreAlumno || this.busquedaFecha) {
      resultado = resultado.filter((nota) => {
        const coincideNombre = !this.busquedaNombreAlumno ||
          (nota.alumnoNombre && nota.alumnoNombre.toLowerCase().includes(this.busquedaNombreAlumno.toLowerCase()));

        const coincideFecha = !this.busquedaFecha ||
          (nota.fecha && this.formatearFecha(nota.fecha) === this.busquedaFecha);

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

  limpiarBusqueda(): void {
    this.busquedaNombreAlumno = '';
    this.busquedaFecha = '';
    this.aplicarFiltros();
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
