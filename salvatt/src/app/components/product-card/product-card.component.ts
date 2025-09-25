import { Component, input } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  template: `
    <div class="product-card">
      <img
        [src]="product().imageUrl"
        [alt]="product().name"
        width="200"
        height="200"
      />
      <h3>{{ product().name }}</h3>
      <p>{{ product().description }}</p>
    </div>
  `,
  styles: [`
    .product-card {
      border: 1px solid #ccc;
      padding: 1rem;
      margin: 1rem;
      text-align: center;
    }
  `],
})
export class ProductCardComponent {
  product = input.required<Product>();
}