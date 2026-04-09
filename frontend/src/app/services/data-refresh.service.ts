import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataRefreshService {
  private solicitudesRefresh$ = new Subject<void>();
  private usuariosRefresh$ = new Subject<void>();

  getSolicitudesRefresh(): Observable<void> {
    return this.solicitudesRefresh$.asObservable();
  }

  getUsuariosRefresh(): Observable<void> {
    return this.usuariosRefresh$.asObservable();
  }

  notifySolicitudesChanged(): void {
    this.solicitudesRefresh$.next();
  }

  notifyUsuariosChanged(): void {
    this.usuariosRefresh$.next();
  }
}
