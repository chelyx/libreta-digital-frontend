import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserValidatedClass } from '../models/user';
import { Curso } from '../models/curso';
import { UUID } from 'crypto';
import { Asistencia, AsistenciaResponse } from '../models/asistencia';

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

  registerUser(): Observable<any> {
    return this.postProtegido('api/user/register', {});
  }


}
