// src/api/controllers/auth.controller.ts
// Express controllers for authentication endpoints.

import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as authService from '../services/auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json(user);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { token, user } = await authService.loginUser(req.body);
  res.json({ token, user });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const current = await authService.getCurrentUser(req.user!.id);
  res.json(current);
});


