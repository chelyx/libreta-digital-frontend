import { Component, OnInit } from '@angular/core';
// import { TuServicio } from 'src/core/service/tu-servicio.service';

type MateriaRendida = {
nombre: string;
nota: number;
fecha: string; // ISO date string
};

@Component({
selector: 'app-mis-materias',
templateUrl: './mis-materias.component.html',
styleUrls: ['./mis-materias.component.scss']
})
export class MisMateriasComponent implements OnInit {
materias: MateriaRendida[] = [];
loading = false;

// constructor(private svc: TuServicio) {}

ngOnInit(): void {
    this.cargarMaterias();
  }

  private cargarMaterias() {
    this.loading = true;

    // TODO: Reemplazar con tu servicio real
    // this.svc.getMateriasRendidas().subscribe(data => {
    //   this.materias = data;
    //   this.loading = false;
    // });

    // Datos de ejemplo (BORRAR cuando tengas el servicio real)
    setTimeout(() => {
      this.materias = [
        { nombre: 'Arquitectura de Computadoras', nota: 8, fecha: '2024-12-18' },
        { nombre: 'Sistemas Operativos', nota: 7, fecha: '2024-11-20' },
        { nombre: 'Algoritmos y Estructuras de Datos', nota: 9, fecha: '2024-10-15' }
      ];
      this.loading = false;
    }, 1000);
  }
}
