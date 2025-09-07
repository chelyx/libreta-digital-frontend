import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080'; // Cambiar por tu URL real

  constructor(private http: HttpClient, @Inject(AuthService) private auth: AuthService) {}
  getProtegido(endpoint: string): Observable<any> {
    return this.auth.getAccessTokenSilently().pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}${endpoint}`, { headers });
      })
    );
  }

  postProtegido(endpoint: string, data: any): Observable<any> {
    return this.auth.getAccessTokenSilently({
   authorizationParams: {  audience: 'http://localhost:8080'}
}).pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.apiUrl}/${endpoint}`, data, { headers });
      })
    );
  }

  generateCode(): Observable<any> {
    return this.postProtegido('api/codes/generate', {});
  }

  validateCode(code: string): Observable<any> {
    return this.postProtegido('api/codes/validate', { code });
  }
}
