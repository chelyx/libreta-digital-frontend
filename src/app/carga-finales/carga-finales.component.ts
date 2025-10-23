import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/core/service/api.service';

@Component({
selector: 'app-carga-finales',
templateUrl: './carga-finales.component.html',
styleUrls: ['./carga-finales.component.scss']
})
export class CargaFinalesComponent implements OnInit {
materiaId?: string;
mesaId?: string;
 constructor(
    private apiService: ApiService
  ) {}
   ngOnInit(): void {

  }

onSelected(e: { materiaId: string; mesaId: string }) {
    this.materiaId = e.materiaId;
    this.mesaId = e.mesaId;
  }
}
