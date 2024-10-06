import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl = `${environment.apiUrl}/auth/login`;
  private tokenKey = 'authToken';  // La clave para guardar el token en localStorage

  constructor(private http: HttpClient) {}

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        // Guardar el token en el localStorage o sessionStorage
        this.saveToken(response.token);
      })
    );
  }

  // Método para guardar el token
  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Método para eliminar el token
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
