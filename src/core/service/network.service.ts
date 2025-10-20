import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NetworkService {
  public online$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor(private zone: NgZone) {
    const online$ = fromEvent(window, 'online').pipe(mapTo(true));
    const offline$ = fromEvent(window, 'offline').pipe(mapTo(false));

    merge(online$, offline$, of(navigator.onLine)).subscribe(status => {
      this.zone.run(() => this.online$.next(status));
    });
  }


}
