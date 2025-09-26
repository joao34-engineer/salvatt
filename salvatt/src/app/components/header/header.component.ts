import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header">
      <!-- Main Header -->
      <div class="main-header">
        <div class="container">
          <div class="header-content">
            <!-- Logo -->
            <div class="logo">
              <a routerLink="/">
                <h1>Salvatt</h1>
                <span class="tagline">Lingerie Premium</span>
              </a>
            </div>

            <!-- Search Bar -->
            <div class="search-bar">
              <input 
                type="text" 
                placeholder="Buscar produtos..."
                [(ngModel)]="searchQuery"
                (keyup.enter)="search()"
              >
              <button (click)="search()" class="search-btn">
                <i class="icon-search"></i>
              </button>
            </div>

            <!-- Cart -->
            <div class="cart">
              <a routerLink="/cart" class="cart-link">
                <i class="icon-cart"></i>
                <span class="cart-count">{{ cartItemCount() }}</span>
                <div class="cart-info">
                  <span class="cart-text">Meu Carrinho</span>
                  <span class="cart-total">R$ {{ cartTotal() | currency:'BRL':'symbol':'1.2-2' }}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="main-nav">
        <div class="container">
          <ul class="nav-menu">
            <li class="nav-item dropdown">
              <a href="#" class="nav-link">Sutiã</a>
              <div class="dropdown-menu">
                <a routerLink="/category/sutia-com-bojo">Com Bojo</a>
                <a routerLink="/category/sutia-sem-bojo">Sem Bojo</a>
                <a routerLink="/category/sutia-meia-taca">Meia Taça</a>
                <a routerLink="/category/sutia-nadador">Nadador</a>
                <a routerLink="/category/sutia-amamentacao">Amamentação</a>
              </div>
            </li>
            
            <li class="nav-item dropdown">
              <a href="#" class="nav-link">Conjunto</a>
              <div class="dropdown-menu">
                <a routerLink="/category/conjunto-renda">Renda</a>
                <a routerLink="/category/conjunto-bojo">Com Bojo</a>
                <a routerLink="/category/conjunto-sem-bojo">Sem Bojo</a>
                <a routerLink="/category/conjunto-strappy">Strappy</a>
                <a routerLink="/category/conjunto-fitness">Fitness</a>
              </div>
            </li>

            <li class="nav-item dropdown">
              <a href="#" class="nav-link">Calcinha</a>
              <div class="dropdown-menu">
                <a routerLink="/category/calcinha-tanga">Tanga</a>
                <a routerLink="/category/calcinha-fio-dental">Fio Dental</a>
                <a routerLink="/category/calcinha-hot-pant">Hot Pant</a>
                <a routerLink="/category/calcinha-calecon">Caleçon</a>
                <a routerLink="/category/calcinha-cropped">Cropped</a>
              </div>
            </li>

            <li class="nav-item dropdown">
              <a href="#" class="nav-link">Linha Noite</a>
              <div class="dropdown-menu">
                <a routerLink="/category/baby-doll">Baby Doll</a>
                <a routerLink="/category/camisola">Camisola</a>
                <a routerLink="/category/pijama">Pijama</a>
                <a routerLink="/category/camisola-amamentacao">Camisola Amamentação</a>
              </div>
            </li>

            <li class="nav-item">
              <a routerLink="/category/plus-size" class="nav-link">Plus Size</a>
            </li>

            <li class="nav-item">
              <a routerLink="/category/body" class="nav-link">Body</a>
            </li>

            <li class="nav-item">
              <a routerLink="/category/cinta-liga" class="nav-link">Cinta Liga</a>
            </li>

            <li class="nav-item sale">
              <a routerLink="/sale" class="nav-link">Promoções</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn = signal(false);
  userName = signal('');
  searchQuery = '';
  cartItemCount = signal(0);
  cartTotal = signal(0);

  search(): void {
    if (this.searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', this.searchQuery);
    }
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.userName.set('');
    // Implement logout logic
  }
}
