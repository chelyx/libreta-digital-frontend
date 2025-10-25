// src/app/services/sync.service.ts
import { Inject, Injectable } from '@angular/core';
import { OfflineDB } from './offline-db.service';
import { NetworkService } from './network.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, switchMap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({ providedIn: 'root' })
export class SyncService {
  constructor(
    private offlineDB: OfflineDB,
    private network: NetworkService,
    private http: HttpClient,
    @Inject(AuthService) private auth: AuthService
  ) {
    this.network.online$.subscribe(online => {
      if (online) this.syncPending();
      console.log('Estado de red:', online ? 'online' : 'offline');
    });
  }

  async syncPending() {
    // Obtener token una sola vez
    const token = await lastValueFrom(this.auth.getAccessTokenSilently());
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const pending = await this.offlineDB.getAllPending();
    for (const req of pending) {
      this.http.post(req.url, req.body, {headers}).subscribe({
        next: () => console.log('Request reenviada', req),
        error: () => console.log('Error al reenviar', req)
      });
    }
    await this.offlineDB.clearPending();
  }
}
