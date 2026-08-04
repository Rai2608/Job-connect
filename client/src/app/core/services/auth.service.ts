import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'candidate' | 'company' | 'admin';
  isVerified: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // State using Signals
  currentUser = signal<User | null>(null);
  accessToken = signal<string | null>(null);
  
  isAuthenticated = computed(() => !!this.currentUser());
  isCandidate = computed(() => this.currentUser()?.role === 'candidate');
  isCompany = computed(() => this.currentUser()?.role === 'company');
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private http: HttpClient) {
    // Restore session on load
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      this.currentUser.set(JSON.parse(savedUser));
      this.accessToken.set(savedToken);
    }
  }

  register(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, payload);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/verify-email?token=${token}`);
  }

  login(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, payload).pipe(
      tap((res) => {
        if (res.success && res.data) {
          const { user, accessToken } = res.data;
          this.currentUser.set(user);
          this.accessToken.set(accessToken);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', accessToken);
        }
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap((res) => {
        if (res.success && res.data?.accessToken) {
          const token = res.data.accessToken;
          this.accessToken.set(token);
          localStorage.setItem('token', token);
        }
      }),
      catchError((err) => {
        // If refresh fails, log out user
        this.logout().subscribe();
        return throwError(() => err);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.clearSession();
      }),
      catchError((err) => {
        this.clearSession();
        return throwError(() => err);
      })
    );
  }

  private clearSession() {
    this.currentUser.set(null);
    this.accessToken.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, payload);
  }
}
