// src/utils/jwt.ts
// Utility for signing JWTs with the configured secret.
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { env } from '../config/env';

export function signJwt(payload: object, options: SignOptions = { expiresIn: '7d' }): string {
  const secret: Secret = env.JWT_SECRET as Secret;
  if (!secret) throw new Error('JWT secret not configured');
  return jwt.sign(payload as any, secret, options);
}
