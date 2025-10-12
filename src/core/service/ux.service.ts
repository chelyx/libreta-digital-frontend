import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ROLES } from './userService';

export enum PANELES {
  CODE_GENERATOR = 'code-generator',
  CODE_VALIDATOR = 'code-validator',
  MATERIAS = 'materias',
  ASISTENCIA = 'asistencia',
  CALIFICACIONES = 'calificaciones'
}
export interface Actions {
  label: string;
  icon: string;
  panel: string;
  main: boolean;
}

export interface MainCard {
  title: string;
  description: string;
  icon: string;
  panel: string;
  buttonLabel: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})

export class UxService {
  public role: string = '';
 private panel = new BehaviorSubject<string>("");
  constructor() { }

  setPanel(panel: string) {
    this.panel.next(panel);
  }

  currentPanel(): Observable<string> {
    return this.panel.asObservable();
  }

  getActionsByRole(): Actions[] {
    switch(this.role) {
      case ROLES.ALUMNO:
        return [{ label: 'Mis Materias', icon: 'menu_book', panel: PANELES.MATERIAS , main:false},
          { label: 'Generar Código QR', icon: 'qr_code', panel: PANELES.CODE_GENERATOR, main:true }
        ];
      case 'PROFESOR':
        return [ { label: 'Toma de Asistencia', icon: 'groups', panel: PANELES.ASISTENCIA , main:false},
          { label: 'Carga de Finales', icon: 'folder_shared', panel: PANELES.CALIFICACIONES , main:false},
          { label: 'Validar Código QR', icon: 'qr_code_scanner', panel: PANELES.CODE_VALIDATOR, main:true }];
      case 'BEDEL':
        return [{ label: 'Toma de Asistencia', icon: 'groups', panel: PANELES.ASISTENCIA, main:false },
          { label: 'Carga de Finales', icon: 'folder_shared', panel: PANELES.CALIFICACIONES , main:false}];
      default:
        return [];
    }
  }

  getMainCardsByRole(): MainCard[] {
    switch(this.role) {
      case ROLES.ALUMNO:
        return [ {
            title: 'Generar Código QR',
            description: 'Genera tu código para registrar asistencia',
            icon: 'qr_code',
            panel: PANELES.CODE_GENERATOR,
            buttonLabel: 'Generar QR',
            color: 'primary'
          }
       ];
      case ROLES.PROFESOR:
        return [{
           title: 'Validar Código QR',
            description: 'Escanea el código de los alumnos',
            icon: 'qr_code_scanner',
            panel: PANELES.CODE_VALIDATOR,
            buttonLabel: 'Validar QR',
            color: 'primary'
        }]
      default:
        return []
  }
}

}
