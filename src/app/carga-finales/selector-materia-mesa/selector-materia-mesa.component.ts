import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Materia, MesaFinal } from 'src/core/models/models';


import { FinalesService } from 'src/core/service/finales.service';

@Component({
  selector: 'app-selector-materia-mesa',
  templateUrl: './selector-materia-mesa.component.html'
})
export class SelectorMateriaMesaComponent implements OnInit {
  materias: Materia[] = [];
  mesas: MesaFinal[] = [];

  materiaId = '';
  mesaId = '';

  @Output() selected = new EventEmitter<{ materiaId: string; mesaId: string }>();

  constructor(private svc: FinalesService) {}

  ngOnInit(): void {
    this.svc.getMaterias().subscribe(m => this.materias = m);
  }

  onMateriaChange() {
    this.mesaId = '';
    if (!this.materiaId) { this.mesas = []; return; }
    this.svc.getMesasByMateria(this.materiaId).subscribe(ms => this.mesas = ms);
  }

  confirmar() {
    if (this.materiaId && this.mesaId) this.selected.emit({ materiaId: this.materiaId, mesaId: this.mesaId });
  }
}
