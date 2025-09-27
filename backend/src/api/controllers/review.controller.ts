// src/api/controllers/review.controller.ts
// Controller for creating product reviews (purchased-only).

import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as reviewService from '../services/review.service';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(req.user!.id, req.body);
  res.status(201).json(review);
});
