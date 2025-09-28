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
  // Optional fields used in admin screens for editing and inventory/category linkage
  stock?: number;
  categoryId?: string;
  category?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
}