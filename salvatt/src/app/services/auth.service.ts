import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../core/api.token';

type UserRole = 'CUSTOMER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = inject(API_BASE_URL);

  private readonly tokenKey = 'auth_token';
  private readonly returnUrlKey = 'auth_return_url';

  private readonly userSignal = signal<AuthUser | null>(null);
  private readonly tokenSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly user = computed(() => this.userSignal());
  readonly token = computed(() => this.tokenSignal());
  readonly isAuthenticated = computed(() => !!this.userSignal() && !!this.tokenSignal());
  readonly isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');
  readonly loading = computed(() => this.loadingSignal());

  constructor() {
    // Store token changes in localStorage
    effect(() => {
      if (typeof window === 'undefined') return;
      
      const token = this.tokenSignal();
      if (token) {
        window.localStorage.setItem(this.tokenKey, token);
      } else {
        window.localStorage.removeItem(this.tokenKey);
      }
    });
  }

  /**
   * Initialize auth service by checking for stored token
   */
  initialize(): void {
    if (typeof window === 'undefined') return;
    
    const storedToken = window.localStorage.getItem(this.tokenKey);
    if (!storedToken) {
      this.loadingSignal.set(false);
      return;
    }
    
    this.loadingSignal.set(true);
    this.tokenSignal.set(storedToken);
    
    // Validate stored token with backend
    this.fetchCurrentUser().subscribe({
      next: (user) => {
        this.userSignal.set(user);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.clearSession();
        this.loadingSignal.set(false);
      },
    });
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/api/auth/login`, credentials)
      .pipe(
        tap(({ token, user }) => {
          this.tokenSignal.set(token);
          this.userSignal.set(user);
        })
      );
  }

  logout(): void {
    this.clearSession();
    void this.router.navigate(['/']);
  }

  fetchCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.baseUrl}/api/auth/me`).pipe(
      tap((user) => {
        this.userSignal.set(user);
      }),
    );
  }

  setReturnUrl(url: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.sessionStorage.setItem(this.returnUrlKey, url);
  }

  consumeReturnUrl(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const value = window.sessionStorage.getItem(this.returnUrlKey);
    if (value) {
      window.sessionStorage.removeItem(this.returnUrlKey);
    }
    return value;
  }

  getAccessToken(): string | null {
    return this.tokenSignal();
  }

  private clearSession(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.loadingSignal.set(false);
  }
}
