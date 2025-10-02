import { Component } from '@angular/core';

@Component({
selector: 'app-carga-finales',
templateUrl: './carga-finales.component.html',
styleUrls: ['./carga-finales.component.scss']
})
export class CargaFinalesComponent {
materiaId?: string;
mesaId?: string;

onSelected(e: { materiaId: string; mesaId: string }) {
    this.materiaId = e.materiaId;
    this.mesaId = e.mesaId;
  }
}
