import { Injectable } from "@angular/core"
import { type Observable, of } from "rxjs"
import { delay } from "rxjs/operators"
import type { NotaHistorial } from "src/app/historial-notas/historial-notas.component"

@Injectable({
providedIn: "root",
})
export class CalificacionesService {
private readonly STORAGE_KEY = "historial_notas"

constructor() {
    this.initializeMockData()
  }

  private initializeMockData(): void {
    // Solo inicializar si no hay datos
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const mockNotas: NotaHistorial[] = [
        {
          materia: "Arquitectura de Software",
          codigo: "7510",
          nota: 8,
          fecha: "2024-12-18",
          ausente: false,
          tipoExamen: "Final",
        },
        {
          materia: "Base de Datos",
          codigo: "7540",
          nota: 7,
          fecha: "2024-12-19",
          ausente: false,
          tipoExamen: "Final",
        },
        {
          materia: "Sistemas Operativos",
          codigo: "7520",
          nota: 9,
          fecha: "2024-11-20",
          ausente: false,
          tipoExamen: "Final",
        },
        {
          materia: "Algoritmos y Estructuras de Datos",
          codigo: "7530",
          nota: 6,
          fecha: "2024-10-15",
          ausente: false,
          tipoExamen: "Final",
        },
        {
          materia: "Matemática Discreta",
          codigo: "7500",
          nota: 3,
          fecha: "2024-09-10",
          ausente: false,
          tipoExamen: "Final",
        },
        {
          materia: "Física I",
          codigo: "7505",
          nota: null,
          fecha: "2024-08-05",
          ausente: true,
          tipoExamen: "Final",
        },
      ]
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(mockNotas))
    }
  }

  getHistorialNotas(): Observable<NotaHistorial[]> {
    const notasStr = localStorage.getItem(this.STORAGE_KEY)
    const notas: NotaHistorial[] = notasStr ? JSON.parse(notasStr) : []

    // Simular delay de red
    return of(notas).pipe(delay(800))
  }

  agregarNota(nota: NotaHistorial): void {
    const notasStr = localStorage.getItem(this.STORAGE_KEY)
    const notas: NotaHistorial[] = notasStr ? JSON.parse(notasStr) : []
    notas.push(nota)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notas))
  }

  limpiarHistorial(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    this.initializeMockData()
  }
}
