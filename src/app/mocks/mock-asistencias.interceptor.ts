import { Injectable } from '@angular/core';
import {
HttpEvent,
HttpHandler,
HttpInterceptor,
HttpRequest,
HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

function isMockEnabled(): boolean {
  try {
    const p = new URL(window.location.href).searchParams.get('mock');
    if (p === '1' || p === 'true') return true;
    const ls = localStorage.getItem('mock');
    return ls === '1' || ls === 'true';
  } catch {
    return false;
  }
}

@Injectable()
export class MockAsistenciasInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si no está activado el mock o la URL no es /api/*, dejo pasar
    if (!isMockEnabled() || !req.url.startsWith('/api/')) {
      // console.debug('[MOCK OFF] Passthrough:', req.method, req.url);
      return next.handle(req);
    }

    const url = req.url;
    const method = req.method.toUpperCase();

    // 🔵 Log de entrada
    console.info('🟡 [MOCK] intercept', method, url, req.body ?? '');

    // --- GET /api/cursos ---
    if (method === 'GET' && url.startsWith('/api/cursos')) {
      const body = [
        { id: '1A', nombre: 'Redes de información' },
        { id: '2B', nombre: 'Técnicas Avanzadas de Programación' },
        { id: '3C', nombre: 'Proyecto Final' },
      ];
      console.info('🟢 [MOCK] GET /api/cursos ->', body);
      return of(new HttpResponse({ status: 200, body })).pipe(delay(200));
    }

    // --- POST /api/asistencias ---
    if (method === 'POST' && url.startsWith('/api/asistencias')) {
      const savedAt = new Date().toISOString();
      const response = { ok: true, savedAt, received: req.body };
      console.info('🟢 [MOCK] POST /api/asistencias <- payload:', req.body);
      console.info('🟢 [MOCK] POST /api/asistencias -> response:', response);
      return of(new HttpResponse({ status: 201, body: response })).pipe(delay(300));
    }

    // Rutas /api/* no mockeadas -> 404 controlado
    console.warn('🔴 [MOCK] 404 for', method, url);
    return of(
      new HttpResponse({
        status: 404,
        statusText: 'Not Found',
        body: { message: 'Mock 404: ' + url }
      })
    ).pipe(delay(100));
  }
}
