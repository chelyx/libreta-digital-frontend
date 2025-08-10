import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FinalesService } from '../../services/finales.service';

@Component({
  selector: 'app-tabla-carga-notas',
  templateUrl: './tabla-carga-notas.component.html'
})
export class TablaCargaNotasComponent implements OnChanges {
  @Input() mesaId!: string;

  rows: Array<{ alumnoId: string; nombre: string; legajo: string; email: string; nota?: number }> = [];
  loading = false;
  feedback = '';

  constructor(private svc: FinalesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mesaId']?.currentValue) this.cargar();
  }

  private cargar() {
    this.loading = true;
    this.feedback = '';
    this.svc.getInscriptosConAlumno(this.mesaId).subscribe(ins => {
      this.rows = ins.map(i => ({
        alumnoId: i.alumnoId, nombre: i.alumno.nombre, legajo: i.alumno.legajo, email: i.alumno.email
      }));
      // Traigo calificaciones ya guardadas (si hubiera) y las pinto
      this.svc.getCalificacionesByMesa(this.mesaId).subscribe(califs => {
        this.rows = this.rows.map(r => {
          const c = califs.find(x => x.alumnoId === r.alumnoId);
          return { ...r, nota: c?.nota };
        });
        this.loading = false;
      });
    });
  }

  guardar() {
    const payload = this.rows
      .filter(r => r.nota !== undefined && r.nota !== null)
      .map(r => ({ alumnoId: r.alumnoId, nota: Number(r.nota) }));

    if (!payload.length) { this.feedback = 'No hay notas para guardar.'; return; }

    this.loading = true;
    this.svc.guardarNotasYNotificar(this.mesaId, payload).subscribe(({guardadas, mails}) => {
      this.loading = false;
      this.feedback = `Guardadas ${guardadas} notas. Enviados ${mails} emails (mock).`;
    });
  }
}
