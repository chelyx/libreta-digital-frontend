import { Role } from '../models/user';

export const EMAIL_ROLES: Record<string, Role[]> = {
  'bedel@utn.frba.edu.ar': ['BEDEL'],
  'profesor@frba.utn.edu.ar': ['PROFESOR'],
};

export const DOMAIN_ROLES: Record<string, Role[]> = {
  'utnbedel.com': ['BEDEL'],
  'utnprofesor.com': ['PROFESOR'],
};

export const DEFAULT_ROLES: Role[] = ['ALUMNO'];

// Qué curso(s) puede ver cada email
// Usá los IDs reales de tus cursos (ej: '1A', '2B'…)
export const EMAIL_COURSES: Record<string, string[]> = {
  'profesor@frba.utn.edu.ar': ['1A'],     // solo 1A
  // 'profe2@colegio.com': ['2B','3C'],  // si tuviera varios
};

