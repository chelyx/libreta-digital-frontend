import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OfflineDB } from './/offline-db.service';
import { NetworkService } from './network.service';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  constructor(private offlineDB: OfflineDB, private network: NetworkService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si estamos offline y es POST, guardamos y retornamos un HttpResponse vacío
    if (!this.network.online$.value && req.method === 'POST') {
      this.offlineDB.addPending({
        url: req.url,
        body: req.body,
        method: req.method,
        headers: req.headers.keys()
      });

      return of(new HttpResponse({ status: 200, body: { message: 'Guardado offline' } }));
    }

    return next.handle(req).pipe(
      catchError(err => {
        if (!this.network.online$.value) {
          this.offlineDB.addPending({
            url: req.url,
            body: req.body,
            method: req.method,
            headers: req.headers.keys()
          });
          return of(new HttpResponse({ status: 200, body: { message: 'Guardado offline' } }));
        }
        return throwError(() => err);
      })
    );
  }
}
