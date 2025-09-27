// src/api/validators/product.schema.ts
import { z } from 'zod';

export const productIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  categoryId: z.string().uuid().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  price: z.coerce.number().positive(),
  imageUrl: z.string().url().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  categoryId: z.string().uuid(),
});

export const updateProductSchema = createProductSchema.partial();
