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
  asistencias: AlumnoAsistenciaDto[] = [];
  historial: HistorialAsistenciaDto = {} as HistorialAsistenciaDto;
  alumnos: User[] = []
  dias: string[] = [];
  editMode = false;
  constructor(private apiService: ApiService){}

  ngOnInit() {

  }


  toggleEditMode() {
    this.editMode = !this.editMode;
  }
  onCursoChange(curso: Curso): void {
    this.cursoSeleccionado = curso
    this.alumnos = this.cursoSeleccionado.alumnos;
    this.apiService.getHistorialAsistencias(this.cursoSeleccionado.id).subscribe(res => {
        res.alumnos = res.alumnos.map(a => ({
        ...a,
        asistencias: new Map(Object.entries(a.asistencias))
      }));

      this.historial = res;
      this.asistencias = res.alumnos;
      this.dias = res.fechas
      console.log(res);
    });

  }

  getEstadoClase(valor: string | undefined) {
    switch (valor) {
      case 'P': return 'presente';
      case 'A': return 'ausente';
      default: return 'sin-data';
    }
  }

  toggleAsistencia(alumno: AlumnoAsistenciaDto, fecha: string) {
    if(!this.editMode) {
      return
    }
  const actual = alumno.asistencias.get(fecha);

  let nuevo;
  if (!actual) nuevo = 'P';
  else if (actual === 'P') nuevo = 'A';
  else nuevo = null;

  if (nuevo) alumno.asistencias.set(fecha, nuevo);
  else alumno.asistencias.delete(fecha);

  // Opcional: enviar al backend
  // this.asistenciaService.actualizar(alumno.auth0Id, fecha, nuevo).subscribe(...)
}


}
