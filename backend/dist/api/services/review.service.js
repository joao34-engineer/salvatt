"use strict";
// src/api/services/review.service.ts
// Business logic for reviews. Enforces purchased-only rule and uniqueness handled by Prisma schema.
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = createReview;
const prisma_1 = require("../../config/prisma");
const httpError_1 = require("../../utils/httpError");
async function hasPurchasedProduct(userId, productId) {
    const count = await prisma_1.prisma.order.count({
        where: {
            userId,
            items: { some: { productId } },
        },
    });
    return count > 0;
}
async function createReview(userId, params) {
    const purchased = await hasPurchasedProduct(userId, params.productId);
    if (!purchased)
        throw new httpError_1.HttpError(403, 'You can only review products you have purchased');
    const review = await prisma_1.prisma.review.create({
        data: {
            userId,
            productId: params.productId,
            rating: params.rating,
            comment: params.comment,
        },
    });
    return review;
}
//# sourceMappingURL=review.service.js.map