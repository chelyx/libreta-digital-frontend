import { Component, OnInit } from "@angular/core"
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
notas: NotaHistorial[] = []
loading = false
notasAprobadas: NotaHistorial[] = []
notasDesaprobadas: NotaHistorial[] = []
promedio = 0

constructor(private calificacionesService: CalificacionesService) {}

  ngOnInit(): void {
    this.cargarHistorial()
  }

  private cargarHistorial(): void {
    this.loading = true

    // Obtener notas del servicio
    this.calificacionesService.getHistorialNotas().subscribe({
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
    this.notasAprobadas = this.notas.filter((n) => !n.ausente && n.nota !== null && n.nota >= 4)
    this.notasDesaprobadas = this.notas.filter((n) => !n.ausente && n.nota !== null && n.nota < 4)

    const notasValidas = this.notas.filter((n) => !n.ausente && n.nota !== null)
    if (notasValidas.length > 0) {
      const suma = notasValidas.reduce((acc, n) => acc + (n.nota || 0), 0)
      this.promedio = Math.round((suma / notasValidas.length) * 100) / 100
    }
  }

  getEstadoClase(nota: NotaHistorial): string {
    if (nota.ausente) return "ausente"
    if (nota.nota === null) return "pendiente"
    return nota.nota >= 4 ? "aprobada" : "desaprobada"
  }

  getEstadoTexto(nota: NotaHistorial): string {
    if (nota.ausente) return "Ausente"
    if (nota.nota === null) return "Pendiente"
    return nota.nota >= 4 ? "Aprobado" : "Desaprobado"
  }
}
