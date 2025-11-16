import { UUID } from "crypto";

export interface NotaDto {
  alumnoId: string;
  descripcion: string;
  valor: number | null;
}

export interface NotaResponse {
  id: UUID;
  cursoId: UUID;
  nombreCurso: string;
  fecha: Date;
  alumnoId: string;
  alumnoNombre: string;
  descripcion: string;
  valor: number;
}

export interface NotaBulkDto {
  cursoId: UUID;
  notas: NotaDto[];
}
