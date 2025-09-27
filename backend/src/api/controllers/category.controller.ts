// src/api/controllers/category.controller.ts
// Controllers for category endpoints: list (public), create/update (admin-only)

import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as categoryService from '../services/category.service';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const items = await categoryService.listCategories();
  res.json(items);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const created = await categoryService.createCategory(req.body);
  res.status(201).json(created);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const updated = await categoryService.updateCategory(id, req.body);
  res.json(updated);
});
