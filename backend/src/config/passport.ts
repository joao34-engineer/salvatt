// src/config/passport.ts
// Passport configuration for Google OAuth 2.0 authentication

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import { env } from './env';

const prisma = new PrismaClient();

/**
 * Configure Google OAuth 2.0 strategy for Passport
 * This handles the OAuth flow with Google and creates/updates users in our database
 * Only initializes if Google OAuth credentials are provided
 */
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${env.BASE_URL}/api/auth/google/callback`,
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user information from Google profile
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        // Check if user already exists with this Google ID
        let user = await prisma.user.findFirst({
          where: {
            OR: [
              { googleId: googleId },
              { email: email }
            ]
          }
        });

        if (user) {
          // Update existing user with Google ID if not already set
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId: googleId }
            });
          }
        } else {
          // Create new user from Google profile
          user = await prisma.user.create({
            data: {
              email: email,
              name: name || email.split('@')[0], // Use email prefix as fallback name
              googleId: googleId,
              password: '', // No password needed for OAuth users
              role: 'CUSTOMER', // Default role for new users
            }
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, undefined);
      }
    }
    )
  );

  /**
   * Serialize user for session storage
   * In our case, we're using JWT tokens, so this is minimal
   */
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  /**
   * Deserialize user from session storage
   * In our case, we're using JWT tokens, so this is minimal
   */
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
} else {
  console.log('Google OAuth not configured - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required');
}

export default passport;
