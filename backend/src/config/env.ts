// src/config/env.ts
import dotenv from 'dotenv';
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || '3000'),
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '',
};
