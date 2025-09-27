// src/api/validators/cart.schema.ts
import { z } from 'zod';

export const addCartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1),
});

export const productIdParamSchema = z.object({
  productId: z.string().uuid(),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1),
});
