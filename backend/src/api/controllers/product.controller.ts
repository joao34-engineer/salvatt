// src/api/controllers/product.controller.ts
// Express controllers for product endpoints.
// Public: list, get by id. Admin: create, update, delete.

import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as productService from '../services/product.service';
import { getPagination } from '../../utils/pagination';
import { HttpError } from '../../utils/httpError';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { skip, take } = getPagination(req.query as any);
  const { categoryId } = req.query as { categoryId?: string };
  const data = await productService.listProducts({ skip, take, categoryId });
  res.json({
    items: data.items,
    total: data.total,
    pageSize: take,
  });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const product = await productService.getProductById(id);
  if (!product) throw new HttpError(404, 'Product not found');
  res.json(product);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const created = await productService.createProduct(req.body);
  res.status(201).json(created);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const updated = await productService.updateProduct(id, req.body);
  res.json(updated);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  await productService.deleteProduct(id);
  res.status(204).send();
});
