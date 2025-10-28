import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/core/service/api.service';

type Row = {
alumnoId: string;
nombre: string;
legajo: string;
email: string;
notaValor?: string;
bloqueada: boolean;
editando?: boolean;
};

@Component({
selector: 'app-tabla-carga-notas',
templateUrl: './tabla-carga-notas.component.html',
styleUrls: ['./tabla-carga-notas.component.scss']
})
export class TablaCargaNotasComponent implements OnChanges {
@Input() mesaId!: string;

rows: Row[] = [];
loading = false;
feedback = '';

readonly opciones = ['AUS', ...Array.from({length: 10}, (_,i)=>String(i+1))];

constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mesaId']?.currentValue) this.cargar();
  }

  private cargar() {
    this.loading = true;
    this.feedback = '';


  }

  habilitarEdicion(r: Row) { r.editando = true; }

  guardar() {
  }
}
