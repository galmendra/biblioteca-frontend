import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // 🔹 LOGIN sin credenciales ni sesión
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.user) {
             const user: User = {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role as 'admin' | 'student',
            firstName: '',
            lastName: ''
  };

  this.currentUserSubject.next(user);
  localStorage.setItem('user', JSON.stringify(user));
          }
        })
      );
  }

  // 🔹 REGISTRO sin credenciales ni sesión
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.user) {
          const user: User = {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role as 'admin' | 'student',
          firstName: '',
          lastName: ''
        };

        this.currentUserSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
          }
        })
      );
  }

  // 🔹 LOGOUT local (solo limpia el estado)
  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  // 🔹 Inicializa desde localStorage
  checkAuth(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    } else {
      this.currentUserSubject.next(null);
    }
  }
}