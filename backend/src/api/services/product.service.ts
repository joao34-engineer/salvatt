// src/api/services/product.service.ts
// Business logic for product operations including pagination and filtering.

import { prisma } from '../../config/prisma';

export async function listProducts(params: { skip: number; take: number; categoryId?: string }) {
  const where = params.categoryId ? { categoryId: params.categoryId } : {};
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, skip: params.skip, take: params.take, orderBy: { createdAt: 'desc' } }),
    prisma.product.count({ where }),
  ]);
  return { items, total };
}

export function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock?: number;
  categoryId: string;
}) {
  return prisma.product.create({ data });
}

export function updateProduct(id: string, data: Partial<{ name: string; description?: string; price: number; imageUrl?: string; stock: number; categoryId: string }>) {
  return prisma.product.update({ where: { id }, data });
}

export function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}
