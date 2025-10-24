import { UUID } from "crypto";

export interface Asistencia {
  id: UUID;
  cursoId: UUID;
  alumnoId: string;
  presente: boolean;
  fecha: Date;
}

export interface AsistenciaResponse {
  id: UUID;
  cursoId: UUID;
  auth0Id: string;
  nombre: string;
  presente: boolean;
  fecha: string;
}
