import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, map } from 'rxjs';
import { Alumno, Materia, MesaFinal, InscripcionFinal, CalificacionFinal } from '../models';
import { MOCK_ALUMNOS, MOCK_MATERIAS, MOCK_MESAS, MOCK_INSCRIPTOS, MOCK_CALIFICACIONES_INICIALES } from '../mocks/calificaciones.mock';

const LS_KEY = 'calificaciones-finales';

@Injectable({ providedIn: 'root' })
export class FinalesService {
  private materias$ = new BehaviorSubject<Materia[]>(MOCK_MATERIAS);
  private mesas$    = new BehaviorSubject<MesaFinal[]>(MOCK_MESAS);
  private alumnos$  = new BehaviorSubject<Alumno[]>(MOCK_ALUMNOS);
  private insc$     = new BehaviorSubject<InscripcionFinal[]>(MOCK_INSCRIPTOS);

  private califs$   = new BehaviorSubject<CalificacionFinal[]>(this.loadFromLS());

  // ==== GETTERS (mocks con pequeño delay para simular red) ====
  getMaterias(): Observable<Materia[]> { return this.materias$.pipe(delay(150)); }

  getMesasByMateria(materiaId: string): Observable<MesaFinal[]> {
    return this.mesas$.pipe(map(m => m.filter(x => x.materiaId === materiaId)), delay(150));
  }

  getInscriptosConAlumno(mesaId: string): Observable<(InscripcionFinal & { alumno: Alumno })[]> {
    return this.insc$.pipe(
      map(ins => ins.filter(i => i.mesaId === mesaId && i.estado === 'anotado')
        .map(i => ({ ...i, alumno: this.alumnos$.value.find(a => a.id === i.alumnoId)! }))),
      delay(200)
    );
  }

  getCalificacionesByMesa(mesaId: string): Observable<CalificacionFinal[]> {
    return this.califs$.pipe(map(arr => arr.filter(c => c.mesaId === mesaId)), delay(120));
  }

  // ==== COMANDOS ====
  guardarNotasYNotificar(mesaId: string, payload: { alumnoId: string; nota: number }[]): Observable<{guardadas:number; mails:number}> {
    const now = new Date().toISOString();
    const actuales = this.califs$.value.slice();
    let guardadas = 0, mails = 0;

    payload.forEach(p => {
      const idx = actuales.findIndex(c => c.mesaId === mesaId && c.alumnoId === p.alumnoId);
      if (idx >= 0) {
        actuales[idx] = { ...actuales[idx], nota: p.nota, fechaCargaISO: now, notificadoEmail: true };
      } else {
        actuales.push({ id: crypto.randomUUID(), mesaId, alumnoId: p.alumnoId, nota: p.nota, fechaCargaISO: now, notificadoEmail: true });
      }
      guardadas++;
      // “enviar” mail (mock)
      const al = this.alumnos$.value.find(a => a.id === p.alumnoId);
      this.mockEnviarEmail(al?.email ?? '', p.nota, mesaId);
      mails++;
    });

    this.califs$.next(actuales);
    this.saveToLS(actuales);

    return of({ guardadas, mails }).pipe(delay(350));
  }

  // ==== EMAIL MOCK ====
  private mockEnviarEmail(to: string, nota: number, mesaId: string) {
    const mesa = this.mesas$.value.find(m => m.id === mesaId);
    const materia = this.materias$.value.find(mt => mt?.id === mesa?.materiaId);
    // Acá luego cambiamos por un EmailService real (EmailJS o backend).
    // Por ahora, consola:
    console.info(`[EMAIL MOCK] A: ${to} | Materia: ${materia?.nombre} | Mesa: ${mesa?.fechaISO} | Nota: ${nota}`);
  }

  // ==== PERSISTENCIA LOCAL ====
  private saveToLS(arr: CalificacionFinal[]) { localStorage.setItem(LS_KEY, JSON.stringify(arr)); }
  private loadFromLS(): CalificacionFinal[] {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return MOCK_CALIFICACIONES_INICIALES; }
  }
}
