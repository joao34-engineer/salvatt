// src/middlewares/auth.ts
// Authentication and authorization middleware using JWT and role-based checks.
// Adds req.user payload for downstream handlers. Ensures admin-only endpoints are protected.

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from '../utils/httpError';
import { Role } from '@prisma/client';

// Extract Bearer token from Authorization header "Bearer <token>"
function extractToken(req: Request): string | null {
  const auth = req.headers.authorization || '';
  const [scheme, token] = auth.split(' ');
  if (scheme?.toLowerCase() === 'bearer' && token) return token;
  return null;
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next(new HttpError(401, 'Authentication required'));

  const secret = env.JWT_SECRET;
  if (!secret) return next(new HttpError(500, 'JWT secret not configured'));

  try {
    const decoded = jwt.verify(token, secret) as Express.UserPayload;
    req.user = decoded;
    return next();
  } catch (err) {
    return next(new HttpError(401, 'Invalid or expired token'));
  }
}

export function isAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) return next(new HttpError(401, 'Authentication required'));
  if (req.user.role !== Role.ADMIN) return next(new HttpError(403, 'Admin privileges required'));
  return next();
}
