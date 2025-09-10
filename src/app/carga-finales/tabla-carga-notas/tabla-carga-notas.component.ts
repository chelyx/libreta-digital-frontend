import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FinalesService } from 'src/core/service/finales.service';


type Row = {
  alumnoId: string;
  nombre: string;
  legajo: string;
  email: string;
  // valor que edita el usuario en el select: 'AUS' | '0'..'10'
  notaValor?: string;
  // estado de bloqueo (si ya se notificó)
  bloqueada: boolean;
  // si el usuario presionó "MODIFICAR NOTAS" en esta fila
  editando?: boolean;
};

@Component({
  selector: 'app-tabla-carga-notas',
  templateUrl: './tabla-carga-notas.component.html'
})
export class TablaCargaNotasComponent implements OnChanges {
  @Input() mesaId!: string;

  rows: Row[] = [];
  loading = false;
  feedback = '';

  // opciones 0..10 + Ausente
  readonly opciones = ['AUS', ...Array.from({length: 11}, (_,i)=>String(i))];

  constructor(private svc: FinalesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mesaId']?.currentValue) this.cargar();
  }

  private cargar() {
    this.loading = true;
    this.feedback = '';

    this.svc.getInscriptosConAlumno(this.mesaId).subscribe(ins => {
      // base
      this.rows = ins.map(i => ({
        alumnoId: i.alumnoId,
        nombre: i.alumno.nombre,
        legajo: i.alumno.legajo,
        email: i.alumno.email,
        bloqueada: false
      }));

      // pinto calificaciones y bloqueo si ya se notificó
      this.svc.getCalificacionesByMesa(this.mesaId).subscribe(califs => {
        this.rows = this.rows.map(r => {
          const c = califs.find(x => x.alumnoId === r.alumnoId);
          return {
            ...r,
            notaValor: c ? (c.ausente ? 'AUS' : (c.nota != null ? String(c.nota) : undefined)) : undefined,
            bloqueada: !!c?.notificadoEmail
          };
        });
        this.loading = false;
      });
    });
  }

  habilitarEdicion(r: Row) { r.editando = true; }

  guardar() {
    // sólo envío los que están editando o no están bloqueados
    const aEnviar = this.rows
      .filter(r => r.notaValor !== undefined && (r.editando || !r.bloqueada))
      .map(r => ({
        alumnoId: r.alumnoId,
        ausente: r.notaValor === 'AUS',
        nota: r.notaValor !== 'AUS' ? parseInt(r.notaValor!, 10) : undefined
      }));

    if (!aEnviar.length) { this.feedback = 'No hay notas para guardar.'; return; }

    this.loading = true;
    this.svc.guardarNotasYNotificar(this.mesaId, aEnviar).subscribe(({guardadas, mails, errores}) => {
      this.loading = false;
      this.feedback = `Guardadas ${guardadas} notas. Emails OK: ${mails}${errores ? ' | Errores: ' + errores : ''}.`;
      // recargo para actualizar bloqueos y limpiar "editando"
      this.cargar();
    });
  }
}
