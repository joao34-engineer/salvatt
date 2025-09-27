"use strict";
// src/utils/pagination.ts
// Utility to parse and clamp pagination parameters.
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNumber = parseNumber;
exports.getPagination = getPagination;
function parseNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}
function getPagination(query) {
    const page = Math.max(1, parseNumber(query.page, 1));
    const limit = Math.min(100, Math.max(1, parseNumber(query.limit, 10)));
    const skip = (page - 1) * limit;
    const take = limit;
    return { page, limit, skip, take };
}
//# sourceMappingURL=pagination.js.map