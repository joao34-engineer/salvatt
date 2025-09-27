// src/api/controllers/cart.controller.ts
// Controllers for cart endpoints. All routes are protected and operate on the current user.

import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as cartService from '../services/cart.service';

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getCart(req.user!.id);
  res.json(cart);
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.addItem(req.user!.id, req.body);
  res.status(201).json(cart);
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params as { productId: string };
  const cart = await cartService.updateItem(req.user!.id, productId, req.body.quantity);
  res.json(cart);
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params as { productId: string };
  const cart = await cartService.removeItem(req.user!.id, productId);
  res.json(cart);
});
