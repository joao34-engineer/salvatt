import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Entrar</h1>
          <p>Acesse sua conta Salvatt</p>
        </div>

        <form class="login-form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="seu@email.com"
            >
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="Sua senha"
            >
          </div>

          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }

          <button type="submit" class="login-btn" [disabled]="loading()">
            @if (loading()) {
              Carregando...
            } @else {
              Entrar
            }
          </button>
        </form>

      </div>
    </div>
  `,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    // Check if already authenticated
    if (this.authService.isAuthenticated()) {
      void this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      return;
    }
    
    this.loading.set(true);
    this.error.set(null);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        const returnUrl = this.authService.consumeReturnUrl();
        void this.router.navigate([returnUrl || '/']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Credenciais inválidas. Tente novamente.');
      },
    });
  }

}
