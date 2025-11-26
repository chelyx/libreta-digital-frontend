import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"
import { ROLES } from "./userService"

export enum PANELES {
CODE_GENERATOR = "code-generator",
CODE_VALIDATOR = "code-validator",
MATERIAS = "materias",
ASISTENCIA = "asistencia",
ASISTENCIA_TABLE = "asistencia-table",
HISTORIAL_NOTAS = "historial-notas",
EDITAR_NOTAS = 'editar-notas',
EXAMEN_WIZARD = 'examen-wizard',
HISTORIAL_ASISTENCIA = 'historial-asistencia',
ASISTENCIA2 = 'asistencia-2',
BUSCAR_FINAL = 'buscar-final'  // <-- NUEVO PANEL
}

export interface Actions {
label: string
icon: string
panel: string
main: boolean
}

export interface MainCard {
title: string
description: string
icon: string
panel: string
buttonLabel: string
color?: string
}

@Injectable({
providedIn: "root",
})
export class UxService {
public role = ""
private panel = new BehaviorSubject<string>("")

constructor() {}

  setPanel(panel: string) {
    this.panel.next(panel)
  }

  currentPanel(): Observable<string> {
    return this.panel.asObservable()
  }

  getActionsByRole(): Actions[] {
    switch (this.role) {
      case ROLES.ALUMNO:
        return [
          { label: "Historial de Notas", icon: "assignment", panel: PANELES.HISTORIAL_NOTAS, main: false },
          { label: "Generar Código QR", icon: "qr_code", panel: PANELES.CODE_GENERATOR, main: true },
          { label: 'Historial de Asistencia', icon: 'history', panel: PANELES.HISTORIAL_ASISTENCIA, main: false },

        ]

      case "PROFESOR":
        return [
          { label: "Toma de Asistencia", icon: "groups", panel: PANELES.ASISTENCIA, main: false },
          // { label: "Historial Asistencias", icon: "table_chart", panel: PANELES.ASISTENCIA_TABLE, main: false },
          { label: "Historial Asistencias", icon: "table_chart", panel: PANELES.ASISTENCIA2, main: false },
          { label: "Examenes Finales", icon: "school", panel: PANELES.EXAMEN_WIZARD, main: true },
          { label: "Gestion de Finales", icon: "search", panel: PANELES.BUSCAR_FINAL, main: false }  // <-- SOLO PROFES/BEDELES
        ]

      case "BEDEL":
        return [
          { label: "Toma de Asistencia", icon: "groups", panel: PANELES.ASISTENCIA, main: true },
          { label: "Historial Asistencias", icon: "table_chart", panel: PANELES.ASISTENCIA2, main: false },
          { label: "Gestión de Finales", icon: "search", panel: PANELES.BUSCAR_FINAL, main: false },  // <-- SOLO PROFES/BEDELES
          { label: "Asistencias", icon: "table_chart", panel: PANELES.ASISTENCIA2, main: false },
        ]

      default:
        return []
    }
  }

  getMainCardsByRole(): MainCard[] {
    switch (this.role) {
      case ROLES.ALUMNO:
        return [
          {
            title: "Generar Código QR",
            description: "Genera tu código para registrar asistencia",
            icon: "qr_code",
            panel: PANELES.CODE_GENERATOR,
            buttonLabel: "Generar QR",
            color: "primary",
          },
        ]
      case ROLES.PROFESOR:
        return [
          {
            title: "Examenes Finales",
            description: "Flujo guiado para mesas de final",
            icon: "school",
            panel: PANELES.EXAMEN_WIZARD,
            buttonLabel: "Examenes Finales",
            color: "primary",
          }
        ]
        case ROLES.BEDEL:
          return [
            {
              title: "Toma de Asistencia",
              description: "Registro rápido de asistencia por curso",
              icon: "groups",
              panel: PANELES.ASISTENCIA,
              buttonLabel: "Toma de Asistencia",
              color: "primary",
            }
          ]
      default:
        return []
    }
  }
}
