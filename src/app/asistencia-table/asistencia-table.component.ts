import { Component, OnInit, Input } from '@angular/core'; // <-- Agrega Input aquí

interface Curso {
id: string;
nombre: string;
codigo: string;
}

@Component({
selector: 'app-asistencia-table',
templateUrl: './asistencia-table.component.html',
styleUrls: ['./asistencia-table.component.scss']
})
export class AsistenciaTableComponent implements OnInit {
// <CHANGE> Agregar decorador @Input() para recibir cursos del componente padre
@Input() cursos: Curso[] = [];  // <-- Esta es la línea clave que falta

cursoSeleccionado: string = '';
cursoIdBusqueda: string = '';

constructor() { }

  ngOnInit(): void {
    console.log('[v0] Cursos recibidos:', this.cursos);
  }

  toggleMenu(): void {
    console.log('[v0] Menu toggled');
  }

  onCursoChange(): void {
    if (this.cursoSeleccionado) {
      this.cursoIdBusqueda = '';
    }
    console.log('[v0] Curso seleccionado:', this.cursoSeleccionado);
  }

  onBuscarPorId(): void {
    if (this.cursoIdBusqueda) {
      this.cursoSeleccionado = '';
    }
    console.log('[v0] Buscando por ID:', this.cursoIdBusqueda);
  }

  buscarCurso(): void {
    const cursoId = this.cursoSeleccionado || this.cursoIdBusqueda;

    if (cursoId) {
      console.log('[v0] Buscando curso con ID:', cursoId);
      // Aquí va tu lógica de navegación
    } else {
      console.warn('No se ha seleccionado ningún curso');
    }
  }
}
