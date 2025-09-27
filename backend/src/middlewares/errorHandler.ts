// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({ error: 'Not Found' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  // Map common Prisma errors to HTTP status codes
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Conflict', details: err.meta });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Record not found', details: err.meta });
    }
  }

  // If the message contains a JSON string from validation, try to parse it for nicer formatting
  let status = err?.status || 500;
  let body: any = { error: err?.message || 'Internal Server Error' };
  try {
    const parsed = JSON.parse(err?.message);
    if (parsed && typeof parsed === 'object' && parsed.errors) {
      status = err?.status || 400;
      body = { error: 'Validation failed', ...parsed };
    }
  } catch (_) {
    // ignore parse failures
  }

  if (process.env.NODE_ENV !== 'production' && err?.stack) {
    body.details = err.stack;
  }

  res.status(status).json(body);
}
