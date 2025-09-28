// src/api/controllers/auth.controller.ts
// Express controllers for authentication endpoints.

import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import * as authService from '../services/auth.service';
import passport from '../../config/passport';
import { env } from '../../config/env';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json(user);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { token, user } = await authService.loginUser(req.body);
  res.json({ token, user });
});

export const googleAuthRedirect = asyncHandler(async (req: Request, res: Response) => {
  // Check if Google OAuth is configured
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    return res.status(501).json({
      message: 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.',
      setup_guide: 'See GOOGLE_OAUTH_SETUP.md for detailed setup instructions'
    });
  }

  // Initiate Google OAuth flow
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res);
});

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  // Handle Google OAuth callback
  passport.authenticate('google', { session: false }, async (err: any, user: any) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.redirect(`${env.FRONTEND_URL}/auth/callback?error=oauth_error`);
    }

    if (!user) {
      return res.redirect(`${env.FRONTEND_URL}/auth/callback?error=no_user`);
    }

    try {
      // Generate JWT token for the user
      const token = await authService.generateToken(user.id);
      
      // Redirect to frontend with token
      res.redirect(`${env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Token generation error:', error);
      res.redirect(`${env.FRONTEND_URL}/auth/callback?error=token_error`);
    }
  })(req, res);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const current = await authService.getCurrentUser(req.user!.id);
  res.json(current);
});


