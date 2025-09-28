"use strict";
// src/api/controllers/auth.controller.ts
// Express controllers for authentication endpoints.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.googleCallback = exports.googleAuthRedirect = exports.login = exports.register = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const authService = __importStar(require("../services/auth.service"));
const passport_1 = __importDefault(require("../../config/passport"));
const env_1 = require("../../config/env");
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { token, user } = await authService.loginUser(req.body);
    res.json({ token, user });
});
exports.googleAuthRedirect = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Check if Google OAuth is configured
    if (!env_1.env.GOOGLE_CLIENT_ID || !env_1.env.GOOGLE_CLIENT_SECRET) {
        return res.status(501).json({
            message: 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.',
            setup_guide: 'See GOOGLE_OAUTH_SETUP.md for detailed setup instructions'
        });
    }
    // Initiate Google OAuth flow
    passport_1.default.authenticate('google', {
        scope: ['profile', 'email']
    })(req, res);
});
exports.googleCallback = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    // Handle Google OAuth callback
    passport_1.default.authenticate('google', { session: false }, async (err, user) => {
        if (err) {
            console.error('Google OAuth error:', err);
            return res.redirect(`${env_1.env.FRONTEND_URL}/auth/callback?error=oauth_error`);
        }
        if (!user) {
            return res.redirect(`${env_1.env.FRONTEND_URL}/auth/callback?error=no_user`);
        }
        try {
            // Generate JWT token for the user
            const token = await authService.generateToken(user.id);
            // Redirect to frontend with token
            res.redirect(`${env_1.env.FRONTEND_URL}/auth/callback?token=${token}`);
        }
        catch (error) {
            console.error('Token generation error:', error);
            res.redirect(`${env_1.env.FRONTEND_URL}/auth/callback?error=token_error`);
        }
    })(req, res);
});
exports.me = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const current = await authService.getCurrentUser(req.user.id);
    res.json(current);
});
//# sourceMappingURL=auth.controller.js.map