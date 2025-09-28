import { HttpInterceptorFn } from '@angular/common/http';

// Simple JWT auth interceptor: reads token from localStorage under 'auth_token'
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  // Debug logging for auth requests
  if (req.url.includes('/api/auth/me')) {
    console.log('🔒 Auth interceptor for /me endpoint');
    console.log('Token found:', token ? 'Yes' : 'No');
    if (token) {
      console.log('Token preview:', token.substring(0, 20) + '...');
    }
  }
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};
