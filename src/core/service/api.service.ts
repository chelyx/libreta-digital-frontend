import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserValidatedClass } from '../models/user';
import { Curso } from '../models/curso';
import { UUID } from 'crypto';
import {  AsistenciaResponse } from '../models/asistencia';
import {  NotaBulkDto, NotaResponse } from '../models/notas';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, @Inject(AuthService) private auth: AuthService) {}
  getProtegido(endpoint: string): Observable<any> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap(token => {
        console.log('Access Token:', token); // Para depuración
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/${endpoint}`, { headers });
      })
    );
  }

  postProtegido(endpoint: string, data?: any): Observable<any> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.apiUrl}/${endpoint}`, data, { headers });
      })
    );
  }

  getRoles(): Observable<any> {
    return this.getProtegido('api/roles');
  }

  generateCode(): Observable<any> {
    return this.postProtegido('api/codes/generate', {});
  }

  validateCode(code: string): Observable<UserValidatedClass> {
    return this.postProtegido('api/codes/validate', { code });
  }

  getMisCursos(): Observable<Curso[]> {
    return this.getProtegido('api/cursos/mios');
  }

   getAsistenciaPorCurso(cursoId: UUID): Observable<AsistenciaResponse[]> {
    return this.getProtegido(`api/asistencias/${cursoId}`);
  }

  saveAsistencia(cursoId: UUID, asistencias: { alumnoId: string; presente: boolean; fecha: Date }[]): Observable<any> {
    return this.postProtegido('api/asistencias/guardar', { cursoId,  asistencias });
  }


  saveNotas(cursoId: UUID, notas: any[]): Observable<any> {
    return this.postProtegido(`api/notas/curso/${cursoId}/bulk`, notas);
  }

  updateNotas(notas: NotaBulkDto): Observable<NotaResponse[]> {
    return this.postProtegido(`api/notas/actualizar-bulk`, notas);
  }

  getNotasByCurso(cursoId: UUID): Observable<NotaResponse[]> {
    return this.getProtegido(`api/notas/curso/${cursoId}`);
  }

  registerUser(): Observable<any> {
    return this.postProtegido('api/user/register', {});
  }


  registrarBFA(): Observable<any> {
        let nota = {
      legajoAlumno: 1673154,
      materia: 'Sistemas de Información II',
      nota: 10,
      fecha: new Date().toUTCString()
    }
    return this.postProtegido('api/notas/registrar', nota);
  }



}
