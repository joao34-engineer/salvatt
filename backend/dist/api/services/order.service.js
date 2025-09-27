"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderFromCart = createOrderFromCart;
exports.listOrders = listOrders;
exports.getOrderById = getOrderById;
exports.updateOrderStatus = updateOrderStatus;
// src/api/services/order.service.ts
const prisma_1 = require("../../config/prisma");
const httpError_1 = require("../../utils/httpError");
async function createOrderFromCart(userId) {
    // Load cart with items and products
    const cart = await prisma_1.prisma.cart.findUnique({
        where: { userId },
        include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0)
        throw new httpError_1.HttpError(400, 'Cart is empty');
    // Validate stock and compute totals
    let total = 0;
    for (const item of cart.items) {
        if (!item.product)
            throw new httpError_1.HttpError(400, 'Invalid product');
        if (item.quantity > (item.product.stock ?? 0)) {
            throw new httpError_1.HttpError(409, `Insufficient stock for product ${item.product.name}`);
        }
        total += item.quantity * item.product.price;
    }
    // Use transaction to create order, items, update stock, and clear cart
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                userId,
                total,
                status: 'PENDING',
                items: {
                    create: cart.items.map((ci) => ({
                        productId: ci.productId,
                        quantity: ci.quantity,
                        price: ci.product.price, // snapshot price
                    })),
                },
            },
            include: { items: true },
        });
        // Update stock for each product
        for (const ci of cart.items) {
            const newStock = (ci.product.stock ?? 0) - ci.quantity;
            await tx.product.update({ where: { id: ci.productId }, data: { stock: newStock } });
        }
        // Clear cart items
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        return order;
    });
    return result;
}
async function listOrders(userId, role) {
    const where = role === 'ADMIN' ? {} : { userId };
    const orders = await prisma_1.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } }, user: { select: { id: true, email: true, name: true } } },
    });
    return orders;
}
async function getOrderById(id, userId, role) {
    const order = await prisma_1.prisma.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } }, user: { select: { id: true, email: true, name: true } } },
    });
    if (!order)
        throw new httpError_1.HttpError(404, 'Order not found');
    if (role !== 'ADMIN' && order.userId !== userId)
        throw new httpError_1.HttpError(403, 'Forbidden');
    return order;
}
function updateOrderStatus(id, status) {
    return prisma_1.prisma.order.update({ where: { id }, data: { status }, include: { items: true } });
}
//# sourceMappingURL=order.service.js.map