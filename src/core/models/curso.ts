import { UUID } from "crypto";
import { User } from "./user";

export interface Curso {
  id: UUID;
  nombre: string;
  codigo: string;
  docenteAuth0Id: string;
  alumnos: User[];
  fecha: string
  esFinal: boolean;
}


export interface ExamenEstadoDto {
  examenId: UUID;
  asistenciaCargada: boolean;
  notasCargadas: boolean;
}
