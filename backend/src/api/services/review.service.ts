// src/api/services/review.service.ts
// Business logic for reviews. Enforces purchased-only rule and uniqueness handled by Prisma schema.

import { prisma } from '../../config/prisma';
import { HttpError } from '../../utils/httpError';

async function hasPurchasedProduct(userId: string, productId: string) {
  const count = await prisma.order.count({
    where: {
      userId,
      items: { some: { productId } },
    },
  });
  return count > 0;
}

export async function createReview(userId: string, params: { productId: string; rating: number; comment?: string }) {
  const purchased = await hasPurchasedProduct(userId, params.productId);
  if (!purchased) throw new HttpError(403, 'You can only review products you have purchased');

  const review = await prisma.review.create({
    data: {
      userId,
      productId: params.productId,
      rating: params.rating,
      comment: params.comment,
    },
  });
  return review;
}
