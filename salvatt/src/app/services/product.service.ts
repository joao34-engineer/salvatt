import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../core/api.token';
import { Product } from '../models/product';

interface BackendProduct {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  stock?: number | null;
  categoryId?: string;
}

interface ListProductsResponse {
  items: BackendProduct[];
  total: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  list(params?: { page?: number; limit?: number; categoryId?: string }): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params?.page) httpParams = httpParams.set('page', params.page);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit);
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);

    return this.http
      .get<ListProductsResponse>(`${this.baseUrl}/api/products`, { params: httpParams })
      .pipe(map((res) => res.items.map((p) => this.mapToUiProduct(p))));
  }

  get(id: string): Observable<Product> {
    return this.http
      .get<BackendProduct>(`${this.baseUrl}/api/products/${id}`)
      .pipe(map((p) => this.mapToUiProduct(p)));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/products/${id}`);
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    return this.http
      .put<BackendProduct>(`${this.baseUrl}/api/products/${id}`, product)
      .pipe(map((p) => this.mapToUiProduct(p)));
  }

  private mapToUiProduct(p: BackendProduct): Product {
    return {
      id: p.id,
      name: p.name,
      description: p.description ?? '',
      imageUrl: p.imageUrl ?? '',
      price: p.price,
      inStock: (p.stock ?? 0) > 0,
      stock: p.stock ?? 0,
      categoryId: p.categoryId,
      // Optional UI-only fields can be omitted or added later
    };
  }
}
