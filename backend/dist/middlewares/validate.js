"use strict";
// src/middlewares/validate.ts
// Zod-based validation middleware for bodies, queries, and params.
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
exports.validateParams = validateParams;
const httpError_1 = require("../utils/httpError");
function formatIssues(issues) {
    return issues.map((i) => ({ path: i.path?.join('.') ?? '', message: i.message }));
}
function validateBody(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return next(new httpError_1.HttpError(400, JSON.stringify({ errors: formatIssues(result.error.issues) })));
        }
        req.body = result.data;
        next();
    };
}
function validateQuery(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            return next(new httpError_1.HttpError(400, JSON.stringify({ errors: formatIssues(result.error.issues) })));
        }
        req.query = result.data;
        next();
    };
}
function validateParams(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            return next(new httpError_1.HttpError(400, JSON.stringify({ errors: formatIssues(result.error.issues) })));
        }
        req.params = result.data;
        next();
    };
}
//# sourceMappingURL=validate.js.map