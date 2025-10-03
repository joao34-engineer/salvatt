export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  inStock: boolean;
  stock?: number;
  categoryId?: string;
}