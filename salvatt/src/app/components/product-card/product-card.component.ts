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

      </div>

      <div class="product-info">
        <h3 class="product-name">{{ product().name }}</h3>
        <p class="product-description">{{ product().description }}</p>

        <!-- Price -->
        <div class="price-section">
          <span class="current-price">{{ product().price | currency:'BRL':'symbol':'1.2-2' }}</span>
        </div>

        <!-- Stock Status -->
        <div class="stock-status">
          @if (product().inStock) {
            <span class="in-stock">✓ Em estoque</span>
          } @else {
            <span class="out-of-stock">✗ Produto esgotado</span>
          }
        </div>
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
  
  showDeleteConfirm = signal(false);

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
}