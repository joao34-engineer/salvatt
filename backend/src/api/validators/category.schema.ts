// src/api/validators/category.schema.ts
import { z } from 'zod';

export const categoryIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1).max(200),
});

export const updateCategorySchema = createCategorySchema.partial();
