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
  private initialized = false;

  readonly user = computed(() => this.userSignal());
  readonly token = computed(() => this.tokenSignal());
  readonly isAuthenticated = computed(() => !!this.userSignal() && !!this.tokenSignal());
  readonly isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');
  readonly loading = computed(() => this.loadingSignal());

  constructor() {
    effect(() => {
      if (typeof window === 'undefined') {
        return;
      }
      const token = this.tokenSignal();
      if (token) {
        console.log('💾 Storing token in localStorage');
        window.localStorage.setItem(this.tokenKey, token);
      } else {
        console.log('🗑️ Removing token from localStorage');
        window.localStorage.removeItem(this.tokenKey);
      }
    });

    // Auto-initialize when service is created in browser environment
    if (typeof window !== 'undefined') {
      // Use setTimeout to ensure DOM and localStorage are ready
      setTimeout(() => {
        console.log('🚀 Auto-initializing auth service...');
        this.initialize();
      }, 100);
    }
  }

  initialize(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }
    this.initialized = true;
    
    const storedToken = window.localStorage.getItem(this.tokenKey);
    console.log('🔍 Initializing auth service...');
    console.log('🔑 Stored token:', storedToken ? 'Found' : 'Not found');
    
    if (!storedToken) {
      console.log('❌ No stored token found');
      this.loadingSignal.set(false);
      return;
    }
    
    console.log('✅ Found stored token, validating with backend...');
    this.loadingSignal.set(true);
    this.tokenSignal.set(storedToken);
    
    this.fetchCurrentUser().subscribe({
      next: (user) => {
        console.log('✅ User restored from token:', user);
        this.userSignal.set(user);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('❌ Failed to restore user from token:', err);
        console.error('Error details:', err.status, err.message);
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
          console.log('🔐 Login successful, storing token and user');
          console.log('Token:', token ? 'Received' : 'Missing');
          console.log('User:', user);
          this.tokenSignal.set(token);
          this.userSignal.set(user);
          console.log('💾 Token stored in localStorage');
        }),
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

  startGoogleLogin(): void {
    if (typeof window === 'undefined') {
      return;
    }
    // Store current URL as return URL for after OAuth
    this.setReturnUrl(window.location.pathname);
    
    // Redirect to backend Google OAuth endpoint
    const target = `${this.baseUrl}/api/auth/google`;
    window.location.href = target;
  }

  // Handle Google OAuth callback
  handleGoogleCallback(token: string, user: AuthUser): void {
    this.tokenSignal.set(token);
    this.userSignal.set(user);
    
    // Navigate to return URL or home
    const returnUrl = this.consumeReturnUrl();
    void this.router.navigate([returnUrl || '/']);
  }

  getAccessToken(): string | null {
    return this.tokenSignal();
  }

  // Public method to set token (for OAuth callbacks)
  setToken(token: string): void {
    this.tokenSignal.set(token);
  }

  private clearSession(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.loadingSignal.set(false);
  }
}
