import { Component, Input } from '@angular/core';
import { AlumnoAsistenciaDto, AsistenciaResponse, HistorialAsistenciaDto } from 'src/core/models/asistencia';
import { Curso } from 'src/core/models/curso';
import { User } from 'src/core/models/user';
import { ApiService } from 'src/core/service/api.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.scss']
})
export class AsistenciaComponent {
  @Input() cursos: Curso[] = [];
 cursoSeleccionado: Curso | null = null;

  historial: HistorialAsistenciaDto = {} as HistorialAsistenciaDto;
  alumnos: User[] = []

  editMode = false;
  constructor(private apiService: ApiService){}

  ngOnInit() {

  }

  guardarCambios() {
    if(!this.cursoSeleccionado) return
    const dto: HistorialAsistenciaDto = {
      fechas: this.historial.fechas,
      alumnos: this.historial.alumnos.map(a => ({
        auth0Id: a.auth0Id,
        nombre: a.nombre,
        asistencias: a.asistencias
      }))
    };

    this.apiService.guardarHistorialAsistencias(dto, this.cursoSeleccionado?.id).subscribe(res => {
      console.log(res)
    });
  }


  toggleEditMode() {
    if (this.editMode) {
      this.guardarCambios();
    }
    this.editMode = !this.editMode;
  }
  onCursoChange(curso: Curso): void {
  this.cursoSeleccionado = curso;
  this.alumnos = curso.alumnos;

  this.apiService.getHistorialAsistencias(curso.id).subscribe(res => {
    // Convertimos asistencias obj → Map
    // res.alumnos = res.alumnos.map(a => ({
    //   ...a,
    //   asistencias: new Map(Object.entries(a.asistencias))
    // }));

    this.historial = res;
    console.log("HISTORIAL CARGADO", this.historial);
  });
}


  getEstadoClase(valor: string | undefined) {
    switch (valor) {
      case 'P': return 'presente';
      case 'A': return 'ausente';
      default: return 'sin-data';
    }
  }

  toggleAsistencia(alumno: any, fecha: string) {
    if (!this.editMode) return;

    const actual = alumno.asistencias[fecha];
    const nuevo = actual === 'P' ? 'A' : 'P';
    alumno.asistencias[fecha] = nuevo;
  }


}
