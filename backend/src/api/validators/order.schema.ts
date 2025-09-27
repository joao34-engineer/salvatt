// src/api/validators/order.schema.ts
import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const orderIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});
