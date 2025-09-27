"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = getCart;
exports.addItem = addItem;
exports.updateItem = updateItem;
exports.removeItem = removeItem;
// src/api/services/cart.service.ts
const prisma_1 = require("../../config/prisma");
const httpError_1 = require("../../utils/httpError");
async function ensureCart(userId) {
    let cart = await prisma_1.prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
        cart = await prisma_1.prisma.cart.create({ data: { userId } });
    }
    return cart;
}
async function getCart(userId) {
    const cart = await ensureCart(userId);
    const full = await prisma_1.prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { product: true } } },
    });
    return full;
}
async function addItem(userId, params) {
    const product = await prisma_1.prisma.product.findUnique({ where: { id: params.productId } });
    if (!product)
        throw new httpError_1.HttpError(404, 'Product not found');
    if (params.quantity < 1)
        throw new httpError_1.HttpError(400, 'Quantity must be at least 1');
    const cart = await ensureCart(userId);
    const key = { cartId_productId: { cartId: cart.id, productId: params.productId } };
    // If exists, set to provided quantity; otherwise create with quantity
    const existing = await prisma_1.prisma.cartItem.findUnique({ where: key });
    if (existing) {
        await prisma_1.prisma.cartItem.update({ where: key, data: { quantity: params.quantity } });
    }
    else {
        await prisma_1.prisma.cartItem.create({ data: { cartId: cart.id, productId: params.productId, quantity: params.quantity } });
    }
    return getCart(userId);
}
async function updateItem(userId, productId, quantity) {
    if (quantity < 1)
        throw new httpError_1.HttpError(400, 'Quantity must be at least 1');
    const cart = await ensureCart(userId);
    const key = { cartId_productId: { cartId: cart.id, productId } };
    await prisma_1.prisma.cartItem.update({ where: key, data: { quantity } });
    return getCart(userId);
}
async function removeItem(userId, productId) {
    const cart = await ensureCart(userId);
    const key = { cartId_productId: { cartId: cart.id, productId } };
    await prisma_1.prisma.cartItem.delete({ where: key });
    return getCart(userId);
}
//# sourceMappingURL=cart.service.js.map