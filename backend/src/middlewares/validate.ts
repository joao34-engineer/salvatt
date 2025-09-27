// src/middlewares/validate.ts
// Zod-based validation middleware for bodies, queries, and params.

import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { HttpError } from '../utils/httpError';

function formatIssues(issues: any[]) {
  return issues.map((i) => ({ path: i.path?.join('.') ?? '', message: i.message }));
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new HttpError(400, JSON.stringify({ errors: formatIssues(result.error.issues) })));
    }
    req.body = result.data as any;
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(new HttpError(400, JSON.stringify({ errors: formatIssues(result.error.issues) })));
    }
    req.query = result.data as any;
    next();
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(new HttpError(400, JSON.stringify({ errors: formatIssues(result.error.issues) })));
    }
    req.params = result.data as any;
    next();
  };
}
