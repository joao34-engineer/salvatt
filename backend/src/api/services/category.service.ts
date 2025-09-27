// src/api/services/category.service.ts
import { prisma } from '../../config/prisma';

export function listCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export function createCategory(data: { name: string }) {
  return prisma.category.create({ data });
}

export function updateCategory(id: string, data: Partial<{ name: string }>) {
  return prisma.category.update({ where: { id }, data });
}
