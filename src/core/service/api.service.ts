import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User} from '../models/user';
import { Curso, ExamenEstadoDto } from '../models/curso';
import { UUID } from 'crypto';
import {  AsistenciaAlumnoDto, AsistenciaResponse, HistorialAsistenciaDto } from '../models/asistencia';
import {  NotaBulkDto, NotaDto, NotaResponse } from '../models/notas';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, @Inject(AuthService) private auth: AuthService) {}
  getProtegido(endpoint: string, responseType?: string): Observable<any> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap(token => {
        console.log('Access Token:', token); // Para depuración
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const options: any = {
          headers
        };
        // Si necesita blob, lo ponemos acá
        if (responseType) {
          options.responseType = 'blob';
        }
        return this.http.get(`${this.apiUrl}/${endpoint}`, options);
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

    putProtegido(endpoint: string, data?: any): Observable<any> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.put(`${this.apiUrl}/${endpoint}`, data, { headers });
      })
    );
  }


  getRoles(): Observable<any> {
    return this.getProtegido('api/roles');
  }

  generateCode(): Observable<any> {
    return this.postProtegido('api/codes/generate', {});
  }

  validateCode(code: string): Observable<User> {
    return this.postProtegido('api/codes/validate', { code });
  }

  getMisCursos(): Observable<Curso[]> {
    return this.getProtegido('api/cursos/todos');
  }

   getAsistenciaPorCurso(cursoId: UUID): Observable<AsistenciaResponse[]> {
    return this.getProtegido(`api/asistencias/${cursoId}`);
  }

  saveAsistencia(cursoId: UUID, asistencias: { alumnoId: string; presente: boolean; fecha: Date }[]): Observable<any> {
    return this.postProtegido('api/asistencias/guardar', { cursoId,  asistencias });
  }


  saveNotas(cursoId: UUID, notas: NotaDto[]): Observable<any> {
    return this.postProtegido(`api/notas/curso/${cursoId}/bulk`, notas);
  }

  updateNotas(notas: NotaBulkDto): Observable<NotaResponse[]> {
    return this.postProtegido(`api/notas/actualizar-bulk`, notas);
  }

  getNotasByCurso(cursoId: UUID): Observable<NotaResponse[]> {
    return this.getProtegido(`api/notas/curso/${cursoId}`);
  }


getNotasPorAlumno(): Observable<NotaResponse[]> {
  return this.getProtegido(`api/notas/me`);
}

  registerUser(): Observable<any> {
    return this.postProtegido('api/user/register', {});
  }

  getCursoPorCodigo(codigo: string) {
  const safe = encodeURIComponent(codigo.trim());
  // Si implementaste la variante con query param, cambia por:
  // return this.getProtegido(`api/cursos/buscar?codigo=${safe}`);
  return this.getProtegido(`api/cursos/codigo/${safe}`);
}

getByCodigoYFecha(codigo: string, fecha: string) {
  return this.getProtegido(`api/cursos/busqueda/final?codigo=${encodeURIComponent(codigo)}&fecha=${encodeURIComponent(fecha)}`);
}

 actualizarAsistenciaAlumno(cursoId: string, dto: Object): Observable<any> {
    // Si ya usas un interceptor de Auth, no hace falta headers extra aquí.

    return this.putProtegido(`api/asistencias/${cursoId}/alumno/actualizar`, dto);
}

  registrarBFA(notas: UUID[]): Observable<any> {
    return this.postProtegido('api/notas/sellar-this', notas);
  }

  getEstadoExamen(examenId: UUID): Observable<ExamenEstadoDto> {
    return this.getProtegido(`api/cursos/${examenId}/estado`);
  }

  uploadActa(formData: FormData): Observable<string> {
    return this.postProtegido('api/notas/upload-acta', formData);
  }

  getMisAsistencias(): Observable<AsistenciaResponse[]> {
    return this.getProtegido('api/asistencias/me');
  }


  descargarJson(notaId: UUID) {
    return this.getProtegido(`api/notas/${notaId}/json`, 'blob');

  }

  descargarRd(notaId: UUID) {
    return this.getProtegido(`api/notas/${notaId}/rd`, 'blob');
  }

  getHistorialAsistencias(cursoId: UUID): Observable<HistorialAsistenciaDto> {
    return this.getProtegido(`api/asistencias/historial/${cursoId}`)
  }

}
