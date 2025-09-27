// src/api/controllers/order.controller.ts
// Controllers for order endpoints: create from cart, list by role, get by id, admin update status.

import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as orderService from '../services/order.service';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.createOrderFromCart(req.user!.id);
  res.status(201).json(order);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const orders = await orderService.listOrders(req.user!.id, req.user!.role);
  res.json(orders);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const order = await orderService.getOrderById(id, req.user!.id, req.user!.role);
  res.json(order);
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { status } = req.body as { status: any };
  const updated = await orderService.updateOrderStatus(id, status);
  res.json(updated);
});
