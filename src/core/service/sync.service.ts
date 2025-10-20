// src/app/services/sync.service.ts
import { Injectable } from '@angular/core';
import { OfflineDB } from './offline-db.service';
import { NetworkService } from './network.service';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SyncService {
  constructor(
    private offlineDB: OfflineDB,
    private network: NetworkService,
    private http: HttpClient
  ) {
    this.network.online$.subscribe(online => {
      if (online) this.syncPending();
    });
  }

  async syncPending() {
    const pending = await this.offlineDB.getAllPending();
    for (const req of pending) {
      this.http.post(req.url, req.body).subscribe({
        next: () => console.log('Request reenviada', req),
        error: () => console.log('Error al reenviar', req)
      });
    }
    await this.offlineDB.clearPending();
  }
}
