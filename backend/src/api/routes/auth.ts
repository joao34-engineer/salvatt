// src/api/routes/auth.ts
import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateBody } from '../../middlewares/validate';
import { registerSchema, loginSchema } from '../validators/auth.schema';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);

// Initiates OAuth login with Google. Frontend should redirect user here.
router.get('/google', authController.googleAuthRedirect);
// Handles Google's callback exchange and returns JWT.
router.get('/google/callback', authController.googleCallback);

router.get('/me', authenticate, authController.me);

export default router;
