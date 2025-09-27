"use strict";
// src/api/services/auth.service.ts
// Business logic for authentication and user account operations.
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getCurrentUser = getCurrentUser;
const prisma_1 = require("../../config/prisma");
const httpError_1 = require("../../utils/httpError");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
async function registerUser(params) {
    const existing = await prisma_1.prisma.user.findUnique({ where: { email: params.email } });
    if (existing) {
        throw new httpError_1.HttpError(409, 'Email already in use');
    }
    const passwordHash = await (0, password_1.hashPassword)(params.password);
    const user = await prisma_1.prisma.user.create({
        data: {
            name: params.name,
            email: params.email,
            password: passwordHash,
        },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return user;
}
async function loginUser(params) {
    const user = await prisma_1.prisma.user.findUnique({ where: { email: params.email } });
    if (!user)
        throw new httpError_1.HttpError(401, 'Invalid credentials');
    const ok = await (0, password_1.comparePassword)(params.password, user.password);
    if (!ok)
        throw new httpError_1.HttpError(401, 'Invalid credentials');
    const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
    const token = (0, jwt_1.signJwt)(payload);
    const safeUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    return { token, user: safeUser };
}
async function getCurrentUser(userId) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user)
        throw new httpError_1.HttpError(404, 'User not found');
    return user;
}
//# sourceMappingURL=auth.service.js.map