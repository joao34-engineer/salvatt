import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'admin/add-product',
    loadComponent: () => import('./pages/add-product/add-product.component').then(m => m.AddProductComponent),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/edit-product/:id',
    loadComponent: () => import('./pages/edit-product/edit-product.component').then(m => m.EditProductComponent),
    canActivate: [adminGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
