"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategorySchema = exports.createCategorySchema = exports.categoryIdParamSchema = void 0;
// src/api/validators/category.schema.ts
const zod_1 = require("zod");
exports.categoryIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
});
exports.updateCategorySchema = exports.createCategorySchema.partial();
//# sourceMappingURL=category.schema.js.map