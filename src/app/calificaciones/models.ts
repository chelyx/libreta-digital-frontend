export interface Alumno {
  id: string;
  nombre: string;
  legajo: string;
  email: string;
}

export interface Materia {
  id: string;
  codigo: string;
  nombre: string;
}

export interface MesaFinal {
  id: string;
  materiaId: string;
  fechaISO: string; // '2025-12-18'
}

export interface InscripcionFinal {
  id: string;
  mesaId: string;
  alumnoId: string;
  estado: 'anotado' | 'baja';
}

export interface CalificacionFinal {
  id: string;
  mesaId: string;
  alumnoId: string;
  nota: number;              // 0..10
  fechaCargaISO: string;     // ISO
  notificadoEmail?: boolean; // mock de envío
}
