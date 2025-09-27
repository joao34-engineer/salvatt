// src/api/services/order.service.ts
import { prisma } from '../../config/prisma';
import { HttpError } from '../../utils/httpError';
import { OrderStatus, Role } from '@prisma/client';

export async function createOrderFromCart(userId: string) {
  // Load cart with items and products
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
  if (!cart || cart.items.length === 0) throw new HttpError(400, 'Cart is empty');

  // Validate stock and compute totals
  let total = 0;
  for (const item of cart.items) {
    if (!item.product) throw new HttpError(400, 'Invalid product');
    if (item.quantity > (item.product.stock ?? 0)) {
      throw new HttpError(409, `Insufficient stock for product ${item.product.name}`);
    }
    total += item.quantity * item.product.price;
  }

  // Use transaction to create order, items, update stock, and clear cart
  const result = await prisma.$transaction(async (tx) => {
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

export async function listOrders(userId: string, role: Role) {
  const where = role === 'ADMIN' ? {} : { userId };
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } }, user: { select: { id: true, email: true, name: true } } },
  });
  return orders;
}

export async function getOrderById(id: string, userId: string, role: Role) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, user: { select: { id: true, email: true, name: true } } },
  });
  if (!order) throw new HttpError(404, 'Order not found');
  if (role !== 'ADMIN' && order.userId !== userId) throw new HttpError(403, 'Forbidden');
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.order.update({ where: { id }, data: { status }, include: { items: true } });
}
