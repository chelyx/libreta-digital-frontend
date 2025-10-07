import { Injectable, Optional } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface AsistenciaItem {
dni: string;
presente: boolean;
}

export interface AsistenciaPayload {
id?: string;                // lo genero local para idempotencia
fecha: string;              // ISO yyyy-mm-dd
cursoId: string | null;     // null = todos
items: AsistenciaItem[];    // alumnos
ts: string;                 // timestamp ISO de creación
}

/**
* Outbox ultra simple basado en localStorage.
* - Cola en STORAGE_KEY
* - Flush automático al volver online
* - Usa HttpClient si está disponible (respetando interceptores). Si no, cae a fetch.
*/
@Injectable({ providedIn: 'root' })
export class AsistenciaOfflineService {
private readonly STORAGE_KEY = 'outbox_asistencias_v1';
private readonly BASE = '/api/asistencias'; // ajustá si tu backend usa otra ruta
private flushing = false;

constructor(@Optional() private http?: HttpClient) {
    window.addEventListener('online', () => this.flush());
  }

  /** Guarda en outbox y dispara flush si hay conexión */
  async add(p: AsistenciaPayload): Promise<void> {
    const enriched: AsistenciaPayload = {
      ...p,
      id: p.id ?? this.buildId(p),
    };
    const q = this.getQueue();
    q.push(enriched);
    this.saveQueue(q);

    if (navigator.onLine) {
      await this.flush();
    }
  }

  /** Intenta enviar todo lo pendiente. Deja en cola lo que falle. */
  async flush(): Promise<void> {
    if (this.flushing) return;
    if (!navigator.onLine) return;

    this.flushing = true;
    try {
      const queue = this.getQueue();
      const remaining: AsistenciaPayload[] = [];

      for (const item of queue) {
        const ok = await this.trySend(item);
        if (!ok) remaining.push(item); // conservar si falló (p.ej. 401, 5xx, red)
      }

      this.saveQueue(remaining);
    } finally {
      this.flushing = false;
    }
  }

  /** Opcional: leer pendientes (por si querés mostrar en UI) */
  getPending(): AsistenciaPayload[] {
    return this.getQueue();
  }

  // --------- helpers ---------

  private buildId(p: AsistenciaPayload): string {
    // id “determinístico” por fecha/curso + hash simple del contenido (evita duplicados casuales)
    const base = `${p.cursoId ?? 'ALL'}:${p.fecha}`;
    const hash = this.hash(JSON.stringify(p.items)).toString(36).slice(0, 6);
    return `${base}:${hash}`;
  }

  private getQueue(): AsistenciaPayload[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]') as AsistenciaPayload[];
    } catch {
      return [];
    }
  }

  private saveQueue(q: AsistenciaPayload[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(q));
  }

  private async trySend(p: AsistenciaPayload): Promise<boolean> {
    try {
      if (this.http) {
        // Usa interceptores (Auth0, etc.)
        await firstValueFrom(this.http.post(`${this.BASE}`, p));
      } else {
        // Fallback si no hay HttpClient (no adjunta Authorization)
        const resp = await fetch(`${this.BASE}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p),
          credentials: 'include',
        });
        if (!resp.ok) return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  private hash(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }
}
