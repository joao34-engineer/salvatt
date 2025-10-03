// src/api/routes/auth.ts
import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateBody } from '../../middlewares/validate';
import { registerSchema, loginSchema } from '../validators/auth.schema';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'auth_ok' });
});

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);

router.get('/me', authenticate, authController.me);

export default router;
