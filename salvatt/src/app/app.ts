import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { Product } from './models/product';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductCardComponent, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('salvatt');

  products = signal<Product[]>([]);

  tempImageUrl = signal<string>('');
  tempDescription = '';

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.tempImageUrl.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  addProduct(): void {
    if (this.tempImageUrl() && this.tempDescription) {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: 'Lingerie Item',
        description: this.tempDescription,
        imageUrl: this.tempImageUrl(),
      };
      this.products.update(products => [...products, newProduct]);
      this.tempImageUrl.set('');
      this.tempDescription = '';
    }
  }
}