import { UUID } from "crypto";

export interface Asistencia {
  id: UUID;
  cursoId: UUID;
  alumnoId: string;
  presente: boolean;
  fecha: Date;
}
