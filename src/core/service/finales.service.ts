import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, map, from, catchError, forkJoin } from 'rxjs';
import { Alumno, Materia, MesaFinal, InscripcionFinal, CalificacionFinal } from '../models/models';
import { MOCK_ALUMNOS, MOCK_MATERIAS, MOCK_MESAS, MOCK_INSCRIPTOS, MOCK_CALIFICACIONES_INICIALES } from '../../app/mocks/calificaciones.mock';
import { EmailService } from './email.service';

const LS_KEY = 'calificaciones-finales';

@Injectable({ providedIn: 'root' })
export class FinalesService {
  private materias$ = new BehaviorSubject<Materia[]>(MOCK_MATERIAS);
  private mesas$    = new BehaviorSubject<MesaFinal[]>(MOCK_MESAS);
  private alumnos$  = new BehaviorSubject<Alumno[]>(MOCK_ALUMNOS);
  private insc$     = new BehaviorSubject<InscripcionFinal[]>(MOCK_INSCRIPTOS);

  private califs$   = new BehaviorSubject<CalificacionFinal[]>(this.loadFromLS());
  constructor(private emailSvc: EmailService) {}

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

/*guardarNotasYNotificar(mesaId: string, payload: { alumnoId: string; nota: number }[])
: Observable<{ guardadas: number; mails: number; errores: number }> {
  const now = new Date().toISOString();
  const actuales = this.califs$.value.slice();
  let guardadas = 0;

  // Determino mesa/materia una sola vez
  const mesa = this.mesas$.value.find(m => m.id === mesaId);
  const materia = this.materias$.value.find(mt => mt?.id === mesa?.materiaId);

  // Actualizo “DB local”
  payload.forEach(p => {
    const idx = actuales.findIndex(c => c.mesaId === mesaId && c.alumnoId === p.alumnoId);
    if (idx >= 0) {
      actuales[idx] = { ...actuales[idx], nota: p.nota, fechaCargaISO: now, notificadoEmail: false };
    } else {
      actuales.push({ id: crypto.randomUUID(), mesaId, alumnoId: p.alumnoId, nota: p.nota, fechaCargaISO: now, notificadoEmail: false });
    }
    guardadas++;
  });

  // Persiste local
  this.califs$.next(actuales);
  this.saveToLS(actuales);

  // Envío de emails en paralelo
  const send$ = payload.map(p => {
    const al = this.alumnos$.value.find(a => a.id === p.alumnoId);
    if (!al?.email) return of({ ok: false });

    // Llamo EmailJS (Promise) -> Observable
    return from(this.emailSvc.sendGrade(
  al.email,
  al.nombre,
  materia?.nombre ?? 'Materia',
  mesa?.fechaISO ?? '',
  p.nota
    )).pipe(
  map(_ => ({ ok: true })),
  catchError((err) => {
    console.error('EmailJS error', err?.text || err); // 👈 te muestra el motivo exacto
    return of({ ok: false });
  })
    );
  });

  // Si no hay nada para enviar, devuelvo rápido
  if (!send$.length) return of({ guardadas, mails: 0, errores: 0 }).pipe(delay(200));

  return forkJoin(send$).pipe(
    map(results => {
      const mails = results.filter(r => r.ok).length;
      const errores = results.length - mails;

      // Marco notificadoEmail=true solo a los que se enviaron bien
      const enviadosIds = payload
        .filter((p, idx) => results[idx].ok)
        .map(p => p.alumnoId);

      const updated = this.califs$.value.map(c =>
        (c.mesaId === mesaId && enviadosIds.includes(c.alumnoId))
          ? { ...c, notificadoEmail: true }
          : c
      );
      this.califs$.next(updated);
      this.saveToLS(updated);

      return { guardadas, mails, errores };
    })
  );
}*/
// antes: payload: { alumnoId: string; nota: number }[]
guardarNotasYNotificar(
  mesaId: string,
  payload: { alumnoId: string; nota?: number; ausente?: boolean }[]
)
: Observable<{ guardadas: number; mails: number; errores: number }> {
  const now = new Date().toISOString();
  const actuales = this.califs$.value.slice();
  let guardadas = 0;

  const mesa = this.mesas$.value.find(m => m.id === mesaId);
  const materia = this.materias$.value.find(mt => mt?.id === mesa?.materiaId);

  payload.forEach(p => {
    const idx = actuales.findIndex(c => c.mesaId === mesaId && c.alumnoId === p.alumnoId);
    const nueva: CalificacionFinal = {
      id: idx >= 0 ? actuales[idx].id : crypto.randomUUID(),
      mesaId,
      alumnoId: p.alumnoId,
      nota: p.ausente ? null : (p.nota ?? null),
      ausente: !!p.ausente,
      fechaCargaISO: now,
      notificadoEmail: false
    };
    if (idx >= 0) actuales[idx] = { ...actuales[idx], ...nueva };
    else actuales.push(nueva);
    guardadas++;
  });

  this.califs$.next(actuales);
  this.saveToLS(actuales);

  // Envío de emails
  const send$ = payload.map(p => {
    const al = this.alumnos$.value.find(a => a.id === p.alumnoId);
    if (!al?.email) return of({ ok: false });

    const notaTexto = p.ausente ? 'Ausente' : String(p.nota);
    return from(this.emailSvc.sendGrade(
      al.email,
      al.nombre,
      materia?.nombre ?? 'Materia',
      mesa?.fechaISO ?? '',
      notaTexto               // <-- admite string 'Ausente'
    )).pipe(
      map(_ => ({ ok: true })),
      catchError(_ => of({ ok: false }))
    );
  });

  if (!send$.length) return of({ guardadas, mails: 0, errores: 0 }).pipe(delay(200));

  return forkJoin(send$).pipe(
    map(results => {
      const mails = results.filter(r => r.ok).length;
      const errores = results.length - mails;

      const enviadosIds = payload
        .filter((p, idx) => results[idx].ok)
        .map(p => p.alumnoId);

      const updated = this.califs$.value.map(c =>
        (c.mesaId === mesaId && enviadosIds.includes(c.alumnoId))
          ? { ...c, notificadoEmail: true }
          : c
      );
      this.califs$.next(updated);
      this.saveToLS(updated);

      return { guardadas, mails, errores };
    })
  );
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
