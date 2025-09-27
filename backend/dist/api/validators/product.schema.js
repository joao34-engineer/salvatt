"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = exports.listProductsQuerySchema = exports.productIdParamSchema = void 0;
// src/api/validators/product.schema.ts
const zod_1 = require("zod");
exports.productIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.listProductsQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional(),
    categoryId: zod_1.z.string().uuid().optional(),
});
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(5000).optional(),
    price: zod_1.z.coerce.number().positive(),
    imageUrl: zod_1.z.string().url().optional(),
    stock: zod_1.z.coerce.number().int().min(0).default(0),
    categoryId: zod_1.z.string().uuid(),
});
exports.updateProductSchema = exports.createProductSchema.partial();
//# sourceMappingURL=product.schema.js.map