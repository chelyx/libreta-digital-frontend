import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Materia, MesaFinal } from 'src/core/models/models';

@Component({
selector: 'app-selector-materia-mesa',
templateUrl: './selector-materia-mesa.component.html',
styleUrls: ['./selector-materia-mesa.component.scss']
})
export class SelectorMateriaMesaComponent implements OnInit {
  materias: Materia[] = [];
  mesas: MesaFinal[] = [];

  materiaId = '';
  mesaId = '';

  @Output() selected = new EventEmitter<{ materiaId: string; mesaId: string }>();

  constructor() {}

  ngOnInit(): void {

  }

  onMateriaChange() {
    this.mesaId = '';
    if (!this.materiaId) { this.mesas = []; return; }

  }

  confirmar() {
    if (this.materiaId && this.mesaId) this.selected.emit({ materiaId: this.materiaId, mesaId: this.mesaId });
  }
}
