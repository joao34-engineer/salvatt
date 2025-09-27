"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const client_1 = require("@prisma/client");
function notFoundHandler(req, res, _next) {
    res.status(404).json({ error: 'Not Found' });
}
function errorHandler(err, _req, res, _next) {
    // Map common Prisma errors to HTTP status codes
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Conflict', details: err.meta });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Record not found', details: err.meta });
        }
    }
    // If the message contains a JSON string from validation, try to parse it for nicer formatting
    let status = err?.status || 500;
    let body = { error: err?.message || 'Internal Server Error' };
    try {
        const parsed = JSON.parse(err?.message);
        if (parsed && typeof parsed === 'object' && parsed.errors) {
            status = err?.status || 400;
            body = { error: 'Validation failed', ...parsed };
        }
    }
    catch (_) {
        // ignore parse failures
    }
    if (process.env.NODE_ENV !== 'production' && err?.stack) {
        body.details = err.stack;
    }
    res.status(status).json(body);
}
//# sourceMappingURL=errorHandler.js.map