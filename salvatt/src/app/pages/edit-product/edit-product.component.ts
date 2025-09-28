import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/api.token';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-edit-product',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-product-container">
      <div class="container">
        <div class="page-header">
          <h1>Editar Produto</h1>
          <p>Atualize as informações do produto</p>
        </div>

        <div class="form-card" *ngIf="!loading() && productId; else loadingTpl">
          <form class="product-form" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Nome do Produto *</label>
                <input
                  type="text"
                  id="name"
                  [(ngModel)]="formData.name"
                  name="name"
                  required
                  placeholder="Nome do produto"
                >
              </div>

              <div class="form-group">
                <label for="price">Preço (R$) *</label>
                <input
                  type="number"
                  id="price"
                  [(ngModel)]="formData.price"
                  name="price"
                  required
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="description">Descrição</label>
              <textarea
                id="description"
                [(ngModel)]="formData.description"
                name="description"
                placeholder="Descrição detalhada do produto"
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Imagem do Produto</label>
              <div class="image-upload-container">
                @if (imagePreview()) {
                  <div class="image-preview">
                    <img [src]="imagePreview()" alt="Preview da imagem">
                  </div>
                }
                <div class="upload-options">
                  <div class="upload-option">
                    <label for="localImage" class="upload-btn">
                      <i class="icon-upload"></i> Carregar do Computador
                    </label>
                    <input
                      type="file"
                      id="localImage"
                      accept="image/*"
                      (change)="onFileSelected($event)"
                      class="file-input"
                    >
                  </div>
                  <div class="upload-option">
                    <label for="imageUrl">Ou use uma URL:</label>
                    <input
                      type="url"
                      id="imageUrl"
                      [(ngModel)]="formData.imageUrl"
                      name="imageUrl"
                      placeholder="https://exemplo.com/imagem.jpg"
                      (input)="onUrlInput($event)"
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="stock">Estoque *</label>
                <input
                  type="number"
                  id="stock"
                  [(ngModel)]="formData.stock"
                  name="stock"
                  required
                  min="0"
                  placeholder="0"
                >
              </div>

              <div class="form-group">
                <label for="categoryId">Categoria *</label>
                <select
                  id="categoryId"
                  [(ngModel)]="formData.categoryId"
                  name="categoryId"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  @for (category of categories(); track category.id) {
                    <option [value]="category.id">{{ category.name }}</option>
                  }
                </select>
              </div>
            </div>

            @if (error()) {
              <div class="error-message">{{ error() }}</div>
            }

            @if (success()) {
              <div class="success-message">Produto atualizado com sucesso!</div>
            }

            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="goBack()">Cancelar</button>
              <button type="submit" class="submit-btn" [disabled]="loading()">
                @if (loading()) {
                  Salvando...
                } @else {
                  Atualizar Produto
                }
              </button>
            </div>
          </form>
        </div>

        <ng-template #loadingTpl>
          <div class="form-card">
            Carregando produto...
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    /* Edit Product Component Styles - reusing Add Product styles for consistency */
    .add-product-container {
      min-height: 100vh;
      background: #f8fafc;
      padding: 40px 0;
    }

    .page-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .page-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 8px;
    }

    .page-header p {
      color: #64748b;
      font-size: 16px;
    }

    .form-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #4a5568;
      font-size: 14px;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 16px;
      background: white;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #e91e63;
      box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 100px;
    }

    /* Image Upload Styles */
    .image-upload-container {
      border: 2px dashed #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      background: #f8fafc;
      transition: border-color 0.3s ease;
    }

    .image-upload-container:hover {
      border-color: #e91e63;
    }

    .image-preview {
      text-align: center;
      margin-bottom: 20px;
    }

    .image-preview img {
      max-width: 200px;
      max-height: 200px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      object-fit: cover;
    }

    .upload-options {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .upload-option {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .upload-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #e91e63, #ad1457);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
      text-align: center;
      justify-content: center;
      max-width: 200px;
    }

    .upload-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
    }

    .file-input {
      display: none;
    }

    .upload-option input[type="url"] {
      margin-top: 4px;
    }

    .error-message {
      background: #fef2f2;
      color: #dc2626;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    .success-message {
      background: #f0fdf4;
      color: #16a34a;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
    }

    .cancel-btn,
    .submit-btn {
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .cancel-btn {
      background: white;
      color: #64748b;
      border-color: #e2e8f0;
    }

    .cancel-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e0;
    }

    .submit-btn {
      background: linear-gradient(135deg, #e91e63, #ad1457);
      color: white;
      border-color: #e91e63;
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(233, 30, 99, 0.3);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Icons */
    .icon-upload::before {
      content: "📁";
      margin-right: 4px;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .form-card {
        padding: 24px;
        margin: 0 16px;
      }

      .form-actions {
        flex-direction: column;
      }

      .cancel-btn,
      .submit-btn {
        width: 100%;
      }

      .upload-btn {
        max-width: 100%;
      }

      .upload-options {
        gap: 12px;
      }
    }
  `],
})
export class EditProductComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly productService = inject(ProductService);
  private readonly sanitizer = inject(DomSanitizer);

  productId: string | null = null;

  formData: Partial<Product> & { stock: number; categoryId: string } = {
    id: '',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    stock: 0,
    categoryId: '',
    inStock: false,
  } as any;

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  imagePreview = signal<SafeUrl | null>(null);
  categories = signal<Category[]>([]);
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (!this.productId) {
      this.error.set('Produto não encontrado.');
      return;
    }

    this.loadCategories();
    this.loadProduct(this.productId);
  }

  loadCategories(): void {
    this.http.get<Category[]>(`${this.baseUrl}/api/categories`).subscribe({
      next: (data) => this.categories.set(data),
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.error.set('Erro ao carregar categorias. Recarregue a página.');
      },
    });
  }

  loadProduct(id: string): void {
    this.loading.set(true);
    this.productService.get(id).subscribe({
      next: (p) => {
        this.formData = {
          id: p.id,
          name: p.name,
          description: p.description ?? '',
          price: p.price,
          imageUrl: p.imageUrl ?? '',
          stock: p.stock ?? 0,
          categoryId: p.categoryId ?? '',
          inStock: p.inStock,
        } as any;
        if (this.formData.imageUrl) {
          this.imagePreview.set(this.sanitizer.bypassSecurityTrustUrl(this.formData.imageUrl));
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load product', err);
        this.error.set('Erro ao carregar produto.');
        this.loading.set(false);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.imagePreview.set(this.sanitizer.bypassSecurityTrustUrl(result));
        this.formData.imageUrl = result; // Store the data URL in the form
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onUrlInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.imagePreview.set(this.sanitizer.bypassSecurityTrustUrl(input.value));
      this.selectedFile = null;
    } else {
      this.imagePreview.set(null);
    }
  }

  onSubmit(): void {
    if (!this.productId) return;
    if (!this.isFormValid()) {
      this.error.set('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const payload: Partial<Product> = {
      name: this.formData.name,
      description: this.formData.description,
      price: this.formData.price,
      imageUrl: this.formData.imageUrl,
      stock: this.formData.stock,
      categoryId: this.formData.categoryId,
    } as any;

    this.productService.update(this.productId, payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => {
          void this.router.navigate(['/']);
        }, 1200);
      },
      error: (err) => {
        console.error('Update product error details:', err);
        this.loading.set(false);
        if (err.status === 401) {
          this.error.set('Não autorizado. Faça login novamente.');
        } else if (err.status === 403) {
          this.error.set('Acesso negado. Apenas administradores podem editar produtos.');
        } else if (err.status === 400) {
          this.error.set(`Dados inválidos: ${err.error?.message || 'Verifique os campos do formulário'}`);
        } else if (err.status === 0) {
          this.error.set('Erro de conexão. Verifique se o backend está rodando.');
        } else {
          this.error.set(`Erro ${err.status}: ${err.error?.message || 'Tente novamente.'}`);
        }
      },
    });
  }

  private isFormValid(): boolean {
    return !!(
      (this.formData.name?.trim() || '').length &&
      (this.formData.price ?? 0) > 0 &&
      (this.formData.stock ?? -1) >= 0 &&
      (this.formData.categoryId || '').length
    );
  }

  goBack(): void {
    void this.router.navigate(['/']);
  }
}
