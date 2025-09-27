// src/api/services/cart.service.ts
import { prisma } from '../../config/prisma';
import { HttpError } from '../../utils/httpError';

async function ensureCart(userId: string) {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
}

export async function getCart(userId: string) {
  const cart = await ensureCart(userId);
  const full = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: true } } },
  });
  return full!;
}

export async function addItem(userId: string, params: { productId: string; quantity: number }) {
  const product = await prisma.product.findUnique({ where: { id: params.productId } });
  if (!product) throw new HttpError(404, 'Product not found');
  if (params.quantity < 1) throw new HttpError(400, 'Quantity must be at least 1');

  const cart = await ensureCart(userId);
  const key = { cartId_productId: { cartId: cart.id, productId: params.productId } } as const;

  // If exists, set to provided quantity; otherwise create with quantity
  const existing = await prisma.cartItem.findUnique({ where: key });
  if (existing) {
    await prisma.cartItem.update({ where: key, data: { quantity: params.quantity } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId: params.productId, quantity: params.quantity } });
  }
  return getCart(userId);
}

export async function updateItem(userId: string, productId: string, quantity: number) {
  if (quantity < 1) throw new HttpError(400, 'Quantity must be at least 1');
  const cart = await ensureCart(userId);
  const key = { cartId_productId: { cartId: cart.id, productId } } as const;
  await prisma.cartItem.update({ where: key, data: { quantity } });
  return getCart(userId);
}

export async function removeItem(userId: string, productId: string) {
  const cart = await ensureCart(userId);
  const key = { cartId_productId: { cartId: cart.id, productId } } as const;
  await prisma.cartItem.delete({ where: key });
  return getCart(userId);
}
