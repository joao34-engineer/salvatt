export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  salePrice?: number;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  category?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
}