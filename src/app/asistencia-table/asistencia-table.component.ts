import { Component, Input, OnInit } from "@angular/core"
import { ApiService } from "src/core/service/api.service"
import { UUID } from "crypto"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Curso } from "src/core/models/curso"

interface AsistenciaResponse {
cursoId: string
fecha: string
auth0Id: string
nombre: string
presente: boolean
}

@Component({
selector: "app-asistencia-table",
templateUrl: "./asistencia-table.component.html",
styleUrls: ["./asistencia-table.component.scss"],
})
export class AsistenciaTableComponent implements OnInit {
fechas: string[] = []
cursoSeleccionado: UUID = "" as UUID
@Input() cursos: Curso[] = []
alumnosMap: Map<
string,
{
nombre: string
asistenciasPorFecha: { [fecha: string]: boolean }
originalAsistenciasPorFecha: { [fecha: string]: boolean }
modificadas: Set<string>
}
> = new Map()

constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {}

  onCursoChange(cursoId: UUID) {
    this.cursoSeleccionado = cursoId
    this.cargarAsistenciasPorCurso(cursoId)
  }

  cargarAsistenciasPorCurso(cursoId: UUID) {
    this.apiService.getAsistenciaPorCurso(cursoId).subscribe((data) => {
      if (!data.length) return
      this.fechas = [...new Set(data.map((a) => a.fecha))].sort()

      data.forEach((a) => {
        if (!this.alumnosMap.has(a.auth0Id)) {
          this.alumnosMap.set(a.auth0Id, {
            nombre: a.nombre,
            asistenciasPorFecha: {},
            originalAsistenciasPorFecha: {},
            modificadas: new Set<string>(),
          })
        }
        const alumno = this.alumnosMap.get(a.auth0Id)!
        alumno.asistenciasPorFecha[a.fecha] = a.presente
        alumno.originalAsistenciasPorFecha[a.fecha] = a.presente
      })
    })
  }

  marcarModificado(auth0Id: string, fecha: string) {
    const alumno = this.alumnosMap.get(auth0Id)
    if (!alumno) return

    const nuevoValor = alumno.asistenciasPorFecha[fecha]
    const original = alumno.originalAsistenciasPorFecha[fecha]

    if (nuevoValor !== original) {
      alumno.modificadas.add(fecha)
    } else {
      alumno.modificadas.delete(fecha)
    }
  }

  hasChanges(): boolean {
    for (const alumno of this.alumnosMap.values()) {
      if (alumno.modificadas.size > 0) return true
    }
    return false
  }

  getChangesCount(): number {
    let count = 0
    this.alumnosMap.forEach((alumno) => (count += alumno.modificadas.size))
    return count
  }

  guardarCambios() {
    const cambios: { alumnoId: string; presente: boolean; fecha: Date }[] = []

    this.alumnosMap.forEach((alumno, auth0Id) => {
      alumno.modificadas.forEach((fecha) => {
        cambios.push({
          fecha: new Date(fecha),
          alumnoId: auth0Id,
          presente: alumno.asistenciasPorFecha[fecha],
        })
      })
    })

    if (!cambios.length) {
      return
    }

    this.apiService.saveAsistencia(this.cursoSeleccionado, cambios).subscribe({
      next: (res) => {
        this.alumnosMap.forEach((alumno) => {
          alumno.modificadas.forEach((fecha) => {
            alumno.originalAsistenciasPorFecha[fecha] = alumno.asistenciasPorFecha[fecha]
          })
          alumno.modificadas.clear()
        })
        this.snackBar.open(res.status, "", { duration: 3000 })
      },
      error: () => console.log("Error al guardar los cambios"),
    })
  }

  trackByAlumno(index: number, item: any) {
    return item.key
  }

  contarPresentes(alumno: any): number {
    let count = 0
    this.fechas.forEach((fecha) => {
      if (alumno.asistenciasPorFecha[fecha]) {
        count++
      }
    })
    return count
  }
}
