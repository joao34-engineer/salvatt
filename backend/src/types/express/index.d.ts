// src/types/express/index.d.ts
import type { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      email: string;
      role: Role;
      name?: string | null;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
