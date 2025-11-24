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
  cursoNombre: string;
  auth0Id: string;
  nombre: string;
  presente: boolean;
  fecha: string;
}

export interface AsistenciaAlumnoDto {
  alumnoId: string;
  fecha: string;
  presente: boolean;
}

export interface AlumnoAsistenciaDto {
  auth0Id: string;
  nombre: string;
  asistencias: Record<string, "P" | "A">;
}

export interface HistorialAsistenciaDto {
  fechas: string[];
  alumnos: AlumnoAsistenciaDto[];
}


