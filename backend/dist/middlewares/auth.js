"use strict";
// src/middlewares/auth.ts
// Authentication and authorization middleware using JWT and role-based checks.
// Adds req.user payload for downstream handlers. Ensures admin-only endpoints are protected.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.isAdmin = isAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const httpError_1 = require("../utils/httpError");
const client_1 = require("@prisma/client");
// Extract Bearer token from Authorization header "Bearer <token>"
function extractToken(req) {
    const auth = req.headers.authorization || '';
    const [scheme, token] = auth.split(' ');
    if (scheme?.toLowerCase() === 'bearer' && token)
        return token;
    return null;
}
function authenticate(req, _res, next) {
    const token = extractToken(req);
    if (!token)
        return next(new httpError_1.HttpError(401, 'Authentication required'));
    const secret = env_1.env.JWT_SECRET;
    if (!secret)
        return next(new httpError_1.HttpError(500, 'JWT secret not configured'));
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        return next();
    }
    catch (err) {
        return next(new httpError_1.HttpError(401, 'Invalid or expired token'));
    }
}
function isAdmin(req, _res, next) {
    if (!req.user)
        return next(new httpError_1.HttpError(401, 'Authentication required'));
    if (req.user.role !== client_1.Role.ADMIN)
        return next(new httpError_1.HttpError(403, 'Admin privileges required'));
    return next();
}
//# sourceMappingURL=auth.js.map