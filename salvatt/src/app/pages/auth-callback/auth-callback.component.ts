import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-callback',
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-card">
        <div class="loading-spinner"></div>
        <h2>Processando login...</h2>
        <p>Aguarde enquanto completamos seu login com Google.</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #fdf2f8 0%, #f8fafc 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .callback-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      padding: 40px;
      text-align: center;
      max-width: 400px;
      width: 100%;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #e91e63;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    h2 {
      color: #2d3748;
      margin-bottom: 12px;
      font-size: 24px;
    }

    p {
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    // Get query parameters from the callback URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const error = params['error'];

      if (error) {
        console.error('Google OAuth error:', error);
        // Redirect to login with error message
        void this.router.navigate(['/login'], { 
          queryParams: { error: 'Erro no login com Google. Tente novamente.' } 
        });
        return;
      }

      if (token) {
        // Store the token and fetch user data
        this.authService.setToken(token);
        
        // Fetch current user data
        this.authService.fetchCurrentUser().subscribe({
          next: (user) => {
            // Navigate to return URL or home
            const returnUrl = this.authService.consumeReturnUrl();
            void this.router.navigate([returnUrl || '/']);
          },
          error: (err) => {
            console.error('Failed to fetch user after Google login:', err);
            void this.router.navigate(['/login'], { 
              queryParams: { error: 'Erro ao completar login. Tente novamente.' } 
            });
          }
        });
      } else {
        // No token provided, redirect to login
        void this.router.navigate(['/login'], { 
          queryParams: { error: 'Login cancelado ou inválido.' } 
        });
      }
    });
  }
}
