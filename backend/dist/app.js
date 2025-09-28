"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const passport_1 = __importDefault(require("./config/passport"));
const errorHandler_1 = require("./middlewares/errorHandler");
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./api/routes"));
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN || '*',
    credentials: true,
}));
// Body parsing
app.use(express_1.default.json());
// Initialize Passport
app.use(passport_1.default.initialize());
// Swagger UI
const openapiFile = path_1.default.resolve(process.cwd(), 'openapi', 'openapi.json');
if (fs_1.default.existsSync(openapiFile)) {
    const spec = JSON.parse(fs_1.default.readFileSync(openapiFile, 'utf8'));
    app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(spec));
}
// API routes
app.use('/api', routes_1.default);
// 404 + error handling
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map