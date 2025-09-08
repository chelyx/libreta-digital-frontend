export type Role = 'BEDEL' | 'PROFESOR' | 'ALUMNO';

export interface User {
  id: string;
  nombre: string;
  email: string;
  roles: Role[];
  token: string;
  allowedCourseIds?: string[];
}
