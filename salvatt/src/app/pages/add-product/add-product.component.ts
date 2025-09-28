import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../core/api.token';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-product-container">
      <div class="container">
        <div class="page-header">
          <h1>Adicionar Produto</h1>
          <p>Adicione novos produtos ao catálogo</p>
        </div>

        <div class="form-card">
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

            @if (error()) {
              <div class="error-message">{{ error() }}</div>
            }

            @if (success()) {
              <div class="success-message">
                <div class="success-icon">✅</div>
                <div class="success-text">
                  <strong>Produto adicionado com sucesso!</strong>
                  <p>Redirecionando para a página inicial...</p>
                </div>
              </div>
            }

            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="goBack()">Cancelar</button>
              <button type="submit" class="submit-btn" [disabled]="loading()">
                @if (loading()) {
                  Salvando...
                } @else {
                  Adicionar Produto
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly sanitizer = inject(DomSanitizer);

  formData: CreateProductRequest = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    stock: 0,
    categoryId: '',
  };

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  imagePreview = signal<SafeUrl | null>(null);
  categories = signal<Category[]>([]);
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get<Category[]>(`${this.baseUrl}/api/categories`).subscribe({
      next: (data) => {
        this.categories.set(data);
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.error.set('Erro ao carregar categorias. Recarregue a página.');
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
    if (!this.isFormValid()) {
      this.error.set('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // Debug: Log what we're sending
    console.log('Sending product data:', this.formData);

    this.http.post(`${this.baseUrl}/api/products`, this.formData).subscribe({
      next: (response) => {
        console.log('Product created successfully:', response);
        this.loading.set(false);
        this.success.set(true);
        const createdId = (response as any)?.id;
        
        // Show success message for 2.5 seconds before navigation
        setTimeout(() => {
          // Reset form
          this.formData = {
            name: '',
            description: '',
            price: 0,
            imageUrl: '',
            stock: 0,
            categoryId: '',
          };
          this.imagePreview.set(null);
          this.selectedFile = null;
          this.success.set(false);
          
          // Navigate back to home to see the new product
          void this.router.navigate(['/']);
        }, 2500);
      },
      error: (err: any) => {
        this.loading.set(false);
        console.error('Add product error details:', err);
        
        // More detailed error messages
        if (err.status === 401) {
          this.error.set('Não autorizado. Faça login novamente.');
        } else if (err.status === 403) {
          this.error.set('Acesso negado. Apenas administradores podem adicionar produtos.');
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
      this.formData.name.trim() &&
      this.formData.price > 0 &&
      this.formData.stock >= 0 &&
      this.formData.categoryId
    );
  }

  goBack(): void {
    void this.router.navigate(['/']);
  }
}
