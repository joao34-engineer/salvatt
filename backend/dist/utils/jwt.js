"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwt = signJwt;
// src/utils/jwt.ts
// Utility for signing JWTs with the configured secret.
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function signJwt(payload, options = { expiresIn: '7d' }) {
    const secret = env_1.env.JWT_SECRET;
    if (!secret)
        throw new Error('JWT secret not configured');
    return jsonwebtoken_1.default.sign(payload, secret, options);
}
//# sourceMappingURL=jwt.js.map