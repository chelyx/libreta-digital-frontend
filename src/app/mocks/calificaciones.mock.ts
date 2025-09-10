import { Alumno, Materia, MesaFinal, InscripcionFinal, CalificacionFinal } from '../../core/models/models';

// Materias
export const MOCK_MATERIAS: Materia[] = [
  { id: 'MAT-01', codigo: '7510', nombre: 'Arquitectura de Software' },
  { id: 'MAT-02', codigo: '7540', nombre: 'Base de Datos' },
];

// Mesas (fecha de final)
export const MOCK_MESAS: MesaFinal[] = [
  { id: 'MESA-ARQ-1', materiaId: 'MAT-01', fechaISO: '2025-12-18' },
  { id: 'MESA-BD-1',  materiaId: 'MAT-02', fechaISO: '2025-12-19' },
];

// Alumnos
export const MOCK_ALUMNOS: Alumno[] = [
  { id: 'A-001', nombre: 'Ana Gómez',    legajo: '167315-4', email: 'ana.gomez@frba.utn.edu.ar' },
  { id: 'A-002', nombre: 'Juan Pérez',   legajo: '168551-0', email: 'juan.perez@frba.utn.edu.ar' },
  { id: 'A-003', nombre: 'Lucía Romero', legajo: '164428-2', email: 'lucia.romero@frba.utn.edu.ar' },
  { id: 'A-004', nombre: 'Yasmin Elias', legajo: '168744-0', email: 'yelias@frba.utn.edu.ar' }
];

// “Anotados” a la mesa
export const MOCK_INSCRIPTOS: InscripcionFinal[] = [
  { id: 'I-1', mesaId: 'MESA-ARQ-1', alumnoId: 'A-001', estado: 'anotado' },
  { id: 'I-2', mesaId: 'MESA-ARQ-1', alumnoId: 'A-002', estado: 'anotado' },
  { id: 'I-3', mesaId: 'MESA-BD-1',  alumnoId: 'A-004', estado: 'anotado' }
];

// Notas (arranca vacío; se va llenando y persiste en localStorage)
export const MOCK_CALIFICACIONES_INICIALES: CalificacionFinal[] = [];
