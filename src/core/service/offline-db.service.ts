
import { Injectable } from '@angular/core';
import { openDB } from 'idb';

@Injectable({ providedIn: 'root' })
export class OfflineDB {
  private dbPromise = openDB('offline-db', 1, {
    upgrade(db) {
      db.createObjectStore('pending', { keyPath: 'id', autoIncrement: true });
    },
  });

  async addPending(data: any) {
    const db = await this.dbPromise;
    await db.add('pending', data);
  }

  async getAllPending() {
    const db = await this.dbPromise;
    return db.getAll('pending');
  }

  async clearPending() {
    const db = await this.dbPromise;
    const tx = db.transaction('pending', 'readwrite');
    await tx.store.clear();
    await tx.done;
  }
}
