// src/api/services/auth.service.ts
// Business logic for authentication and user account operations.

import { prisma } from '../../config/prisma';
import { HttpError } from '../../utils/httpError';
import { hashPassword, comparePassword } from '../../utils/password';
import { signJwt } from '../../utils/jwt';

export async function registerUser(params: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: params.email } });
  if (existing) {
    throw new HttpError(409, 'Email already in use');
  }
  const passwordHash = await hashPassword(params.password);
  const user = await prisma.user.create({
    data: {
      name: params.name,
      email: params.email,
      password: passwordHash,
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return user;
}

export async function loginUser(params: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: params.email } });
  if (!user) throw new HttpError(401, 'Invalid credentials');

  const ok = await comparePassword(params.password, user.password);
  if (!ok) throw new HttpError(401, 'Invalid credentials');

  const payload: Express.UserPayload = { id: user.id, email: user.email, role: user.role, name: user.name };
  const token = signJwt(payload);

  const safeUser = { id: user.id, email: user.email, name: user.name, role: user.role };
  return { token, user: safeUser };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) throw new HttpError(404, 'User not found');
  return user;
}
