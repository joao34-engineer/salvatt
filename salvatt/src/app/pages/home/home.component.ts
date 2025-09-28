import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ProductCardComponent, HeaderComponent],
  template: `
    <app-header></app-header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Coleção Exclusiva</h1>
            <p class="hero-subtitle">Lingerie premium com elegância e conforto</p>
            <button class="cta-button">Explorar Coleção</button>
          </div>
        </div>
      </section>

      @if (authService.isAdmin()) {
        <section class="admin-panel">
          <div class="container">
            <div class="admin-actions">
              <a routerLink="/admin/add-product" class="admin-btn">Adicionar Produto</a>
            </div>
          </div>
        </section>
      }

      <!-- Products Section -->
      <section class="products-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Nossos Produtos</h2>
            <p class="section-subtitle">Descubra nossa coleção exclusiva de lingerie premium</p>
          </div>

          @if (loading()) {
            <div class="loading-state">
              <div class="loading-spinner"></div>
              <p>Carregando produtos...</p>
            </div>
          } @else if (error()) {
            <div class="error-state">
              <div class="error-icon">⚠️</div>
              <h3>Erro ao carregar produtos</h3>
              <p>{{ error() }}</p>
              <button class="retry-btn" (click)="loadProducts()">Tentar novamente</button>
            </div>
          } @else if (products().length > 0) {
            <div class="products-grid">
              @for (product of products(); track product.id) {
                <app-product-card 
                  [product]="product"
                  (onDelete)="onProductDelete($event)"
                  (onEdit)="onProductEdit($event)"
                ></app-product-card>
              }
            </div>
          } @else {
            <div class="empty-state">
              <div class="empty-icon">👗</div>
              <h3>Nenhum produto encontrado</h3>
              <p>Adicione alguns produtos para começar a vender!</p>
            </div>
          }
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Salvatt Lingerie</h3>
            <p>Elegância e conforto em cada peça</p>
          </div>
          <div class="footer-section">
            <h4>Atendimento</h4>
            <p>📞 (22) 2527-2946</p>
            <p>
              <a href="https://wa.me/5521991324587" target="_blank" rel="noopener noreferrer" class="whatsapp-link">
                <span class="whatsapp-icon">📱</span> WhatsApp: (21) 99132-4587
              </a>
            </p>
          </div>
          <div class="footer-section">
            <h4>Horário</h4>
            <p>Segunda a Sexta: 9h às 18h</p>
            <p>Sábado: 9h às 14h</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 Salvatt Lingerie. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  products = signal<Product[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
    
    // Listen for navigation events to refresh products when returning from add-product
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/' || event.url === '/home') {
          this.loadProducts();
        }
      });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productService.list({ page: 1, limit: 12 }).subscribe({
      next: (items) => {
        this.products.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.error.set('Falha ao carregar produtos. Tente novamente.');
        this.loading.set(false);
      },
    });
  }

  onProductDelete(productId: string): void {
    console.log('Deleting product:', productId);
    this.productService.delete(productId).subscribe({
      next: () => {
        console.log('Product deleted successfully');
        // Remove product from list
        this.products.update(products => products.filter(p => p.id !== productId));
      },
      error: (err) => {
        console.error('Failed to delete product', err);
        alert('Erro ao deletar produto. Tente novamente.');
      },
    });
  }

  onProductEdit(productId: string): void {
    console.log('Editing product:', productId);
    // Navigation is handled in the product-card component
  }
}
