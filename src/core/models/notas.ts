import { UUID } from "crypto";

export interface NotaDto {
  id: UUID;
  valor:number;
}

export interface NotaResponse {
  id: UUID;
  cursoId: UUID;
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
