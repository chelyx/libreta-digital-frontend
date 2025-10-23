import { User } from "./user";

export interface Curso {
  id: number;
  nombre: string;
  codigo: string;
  docenteAuth0Id: string;
  alumnos: User[];
}
