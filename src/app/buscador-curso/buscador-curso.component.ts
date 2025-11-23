import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Curso } from 'src/core/models/curso';

@Component({
  selector: 'app-buscador-curso',
  templateUrl: './buscador-curso.component.html',
  styleUrls: ['./buscador-curso.component.scss']
})
export class BuscadorCursoComponent {
  @Input() cursos: Curso[] = [];
  @Output() selected = new EventEmitter<Curso> ();
  cursoSeleccionado: Curso | null = null; // igual que antes
  cursoSeleccionadoTexto: string = '';

  cursosFiltrados: Curso[] = [];

  ngOnInit() {
    this.cursosFiltrados = this.cursos;
  }

  filtrarCursos(valor: string) {
    const filter = valor.toLowerCase();
    this.cursosFiltrados = this.cursos.filter(c =>
      c.nombre.toLowerCase().includes(filter) ||
      c.codigo.toLowerCase().includes(filter)
    );
  }

  onCursoSeleccionado(curso: Curso) {
    this.cursoSeleccionado = curso;
    this.cursoSeleccionadoTexto = `${curso.nombre} - ${curso.codigo}`;
    this.selected.emit(curso);
  }

}
