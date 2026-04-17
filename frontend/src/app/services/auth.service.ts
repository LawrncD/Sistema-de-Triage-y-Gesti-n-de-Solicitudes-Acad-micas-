import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_KEY = 'user_data';
  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password }).pipe(
      tap((res: any) => {
        if (res.exitoso && res.mensaje) {
          // El token JWT viene en el campo 'mensaje'
          this.setToken(res.mensaje);
          // Guardar datos del usuario si vienen en 'datos'
          if (res.datos) {
            this.setUserData(res.datos);
          }
        } else {
          console.warn('AuthService: Login no exitoso o sin token');
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/registro`, userData);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token;
  }

  setUserData(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUserData(): any {
    const data = localStorage.getItem(this.USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const isAuth = !!token;
    return isAuth;
  }
}
