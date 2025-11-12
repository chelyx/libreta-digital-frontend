import { Component, OnInit } from "@angular/core"
import { NotaResponse } from "src/core/models/notas"
import { ApiService } from "src/core/service/api.service"
import { CalificacionesService } from "src/core/service/calificaciones.service"

export interface NotaHistorial {
materia: string
codigo: string
nota: number | null
fecha: string
ausente: boolean
tipoExamen: "Final" | "Parcial" | "Recuperatorio"
}

@Component({
selector: "app-historial-notas",
templateUrl: "./historial-notas.component.html",
styleUrls: ["./historial-notas.component.scss"],
})
export class HistorialNotasComponent implements OnInit {
notas: NotaResponse[] = []
loading = false
notasAprobadas: NotaResponse[] = []
notasDesaprobadas: NotaResponse[] = []
promedio = 0

constructor(private calificacionesService: CalificacionesService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarHistorial()
  }

  private cargarHistorial(): void {
    this.loading = true

    // Obtener notas del servicio
    this.apiService.getNotasPorAlumno('auth0|alum1').subscribe({ //TODO: reemplazar auth0Id hardcodeado
      next: (notas) => {
        this.notas = notas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        this.calcularEstadisticas()
        this.loading = false
      },
      error: (err) => {
        console.error("Error cargando historial:", err)
        this.loading = false
      },
    })
  }

  private calcularEstadisticas(): void {
    this.notasAprobadas = this.notas.filter((n) => n.valor >= 6)
    this.notasDesaprobadas = this.notas.filter((n) => n.valor < 6)

    const notasValidas = this.notas.filter((n) => n.valor !== null)
    if (notasValidas.length > 0) {
      const suma = notasValidas.reduce((acc, n) => acc + (n.valor  || 0), 0)
      this.promedio = Math.round((suma / notasValidas.length) * 100) / 100
    }
  }

  getEstadoClase(nota: NotaResponse): string {
   // if (nota.ausente) return "ausente"
    //if (nota.nota === null) return "pendiente"
    return nota.valor  >= 6 ? "aprobada" : "desaprobada"
  }

  getEstadoTexto(nota: NotaResponse): string {
   // if (nota.ausente) return "Ausente"
   // if (nota.nota === null) return "Pendiente"
    return nota.valor >= 6 ? "Aprobado" : "Desaprobado"
  }
}
