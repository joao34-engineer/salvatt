import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  template: `
    <div class="product-card" [class.favorited]="isFavorited()">
      <div class="product-image-container">
        @if (product().imageUrl) {
          <img [src]="product().imageUrl" [alt]="product().name" class="product-image">
        } @else {
          <div class="placeholder-image">
            <span>Sem Imagem</span>
          </div>
        }
        
        <!-- Favorite Button -->
        <button 
          class="favorite-btn" 
          [class.active]="isFavorited()"
          (click)="toggleFavorite()"
          title="Adicionar aos favoritos"
        >
          <i class="icon-heart"></i>
        </button>

        <!-- Quick View Button -->
        <button class="quick-view-btn" (click)="quickView()" title="Visualização rápida">
          <i class="icon-eye"></i>
        </button>

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

        <!-- Price -->
        <div class="price-section">
          @if (salePrice() !== null) {
            <span class="original-price">R$ {{ product().price | currency:'BRL':'symbol':'1.2-2' }}</span>
            <span class="sale-price">R$ {{ (salePrice() ?? product().price) | currency:'BRL':'symbol':'1.2-2' }}</span>
          } @else {
            <span class="current-price">R$ {{ product().price | currency:'BRL':'symbol':'1.2-2' }}</span>
          }
        </div>

        <!-- Add to Cart Button -->
        <button 
          class="add-to-cart-btn" 
          (click)="addToCart()"
          [disabled]="!product().inStock"
        >
          @if (product().inStock) {
            <i class="icon-cart"></i>
            Adicionar ao Carrinho
          } @else {
            Produto Esgotado
          }
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  product = input.required<Product>();
  isFavorited = signal(false);
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
    if (!this.product().inStock) {
      return;
    }

    // TODO: integrate with cart service once available
    console.log('Added to cart:', this.product().name);
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