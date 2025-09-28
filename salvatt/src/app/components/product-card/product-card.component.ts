import { Component, computed, input, signal, inject, output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  template: `
    <div class="product-card">
      <div class="product-image-container">
        @if (product().imageUrl) {
          <img 
            [src]="product().imageUrl" 
            [alt]="product().name"
            class="product-image"
            loading="lazy"
          >
        } @else {
          <div class="placeholder-image">
            <div class="placeholder-icon">👗</div>
            <span>Sem imagem</span>
          </div>
        }
        
        <!-- Favorite Button -->
        <button 
          class="favorite-btn" 
          [class.active]="isFavorited()"
          (click)="toggleFavorite()"
          title="Adicionar aos favoritos"
        >
          <i class="icon-heart" [class.active]="isFavorited()"></i>
        </button>

        <!-- Quick View Button -->
        <button class="quick-view-btn" (click)="quickView()" title="Visualização rápida">
          <i class="icon-eye"></i>
        </button>

        <!-- Admin Actions - Only visible for admins -->
        @if (authService.isAdmin()) {
          <div class="admin-actions">
            <button class="admin-btn edit-btn" (click)="editProduct()" title="Editar produto">
              <i class="icon-edit"></i>
            </button>
            <button class="admin-btn delete-btn" (click)="deleteProduct()" title="Excluir produto">
              <i class="icon-delete"></i>
            </button>
          </div>
        }

        <!-- Sale Badge -->
        @if (salePrice() !== null) {
          <div class="sale-badge">
            {{ getSalePercentage() }}% OFF
          </div>
        }
      </div>

      <div class="product-info">
        <h3 class="product-name">{{ product().name }}</h3>
        <p class="product-description">{{ product().description }}</p>
        
        <!-- Sizes -->
        @if (productSizes().length > 0) {
          <div class="sizes">
            <span class="sizes-label">Tamanhos:</span>
            @for (size of productSizes(); track size) {
              <span class="size-tag">{{ size }}</span>
            }
          </div>
        }

        <!-- Colors -->
        @if (productColors().length > 0) {
          <div class="colors">
            <span class="colors-label">Cores:</span>
            <div class="color-options">
              @for (color of productColors(); track color) {
                <div 
                  class="color-dot" 
                  [style.background-color]="color"
                  [title]="color"
                ></div>
              }
            </div>
          </div>
        }

        <!-- Price - Fixed currency display -->
        <div class="price-section">
          @if (salePrice() !== null) {
            <span class="original-price">{{ product().price | currency:'BRL':'symbol':'1.2-2' }}</span>
            <span class="sale-price">{{ (salePrice() ?? product().price) | currency:'BRL':'symbol':'1.2-2' }}</span>
          } @else {
            <span class="current-price">{{ product().price | currency:'BRL':'symbol':'1.2-2' }}</span>
          }
        </div>

        <!-- Add to Cart Button -->
        <button 
          class="add-to-cart-btn" 
          (click)="addToCart()"
          [disabled]="!product().inStock || addingToCart()"
          [class.adding]="addingToCart()"
          [class.added]="addedToCart()"
        >
          @if (!product().inStock) {
            <i class="icon-out-of-stock"></i>
            Produto Esgotado
          } @else if (addingToCart()) {
            <i class="icon-loading"></i>
            Adicionando...
          } @else if (addedToCart()) {
            <i class="icon-check"></i>
            Adicionado!
          } @else {
            <i class="icon-cart"></i>
            Adicionar ao Carrinho
          }
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    @if (showDeleteConfirm()) {
      <div class="modal-overlay" (click)="cancelDelete()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Confirmar Exclusão</h3>
            <button class="modal-close" (click)="cancelDelete()">×</button>
          </div>
          <div class="modal-body">
            <p>Tem certeza que deseja excluir o produto <strong>"{{ product().name }}"</strong>?</p>
            <p class="warning-text">Esta ação não pode ser desfeita.</p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="cancelDelete()">Cancelar</button>
            <button class="btn-confirm" (click)="confirmDelete()">Excluir</button>
          </div>
        </div>
      </div>
    }
  `,
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  product = input.required<Product>();
  onDelete = output<string>(); // Emit product ID when deleted
  onEdit = output<string>(); // Emit product ID when edit is requested
  
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  isFavorited = signal(false);
  showDeleteConfirm = signal(false);
  addedToCart = signal(false);
  addingToCart = signal(false);
  
  protected readonly salePrice = computed<number | null>(() => {
    const currentProduct = this.product();
    const { salePrice, price } = currentProduct;
    if (salePrice === undefined || salePrice >= price) {
      return null;
    }
    return salePrice;
  });
  
  protected readonly productSizes = computed(() => this.product().sizes ?? []);
  protected readonly productColors = computed(() => this.product().colors ?? []);

  toggleFavorite(): void {
    this.isFavorited.update(current => !current);
    console.log('Toggled favorite for:', this.product().name);
  }

  quickView(): void {
    console.log('Quick view for:', this.product().name);
  }

  addToCart(): void {
    if (!this.product().inStock || this.addingToCart()) {
      return;
    }
    
    this.addingToCart.set(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Here you would normally call a cart service
      // For now, we'll just show success feedback
      console.log('Added to cart:', this.product().name);
      
      this.addingToCart.set(false);
      this.addedToCart.set(true);
      
      // Reset the success state after 2 seconds
      setTimeout(() => {
        this.addedToCart.set(false);
      }, 2000);
    }, 500);
  }

  editProduct(): void {
    this.onEdit.emit(this.product().id);
    // Navigate to edit page or emit event to parent
    void this.router.navigate(['/admin/edit-product', this.product().id]);
  }

  deleteProduct(): void {
    this.showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    this.onDelete.emit(this.product().id);
    this.showDeleteConfirm.set(false);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }



  getSalePercentage(): number {
    const salePrice = this.salePrice();
    if (salePrice === null) {
      return 0;
    }
    const { price } = this.product();
    return Math.round(((price - salePrice) / price) * 100);
  }
}