// src/app.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';
import { env } from './config/env';
import apiRoutes from './api/routes';

const app = express();

// CORS configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Body parsing with increased limits to support base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger UI
const openapiFile = path.resolve(process.cwd(), 'openapi', 'openapi.json');
if (fs.existsSync(openapiFile)) {
  const spec = JSON.parse(fs.readFileSync(openapiFile, 'utf8'));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
}

// API routes
app.use('/api', apiRoutes);

// 404 + error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
