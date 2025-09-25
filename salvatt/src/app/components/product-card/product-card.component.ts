import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  template: `
    <div class="product-card">
      <img
        [src]="product?.imageUrl"
        [alt]="product?.name"
      />
      <h3>{{ product?.name }}</h3>
      <p>{{ product?.description }}</p>
    </div>
  `,
  styles: [`
    .product-card {
      border: 1px solid #ccc;
      padding: 1rem;
      margin: 1rem;
      text-align: center;
    }
    .product-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
  `],
})
export class ProductCardComponent {
  @Input() product?: Product;
}