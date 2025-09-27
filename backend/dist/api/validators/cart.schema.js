"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartItemSchema = exports.productIdParamSchema = exports.addCartItemSchema = void 0;
// src/api/validators/cart.schema.ts
const zod_1 = require("zod");
exports.addCartItemSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    quantity: zod_1.z.coerce.number().int().min(1),
});
exports.productIdParamSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
});
exports.updateCartItemSchema = zod_1.z.object({
    quantity: zod_1.z.coerce.number().int().min(1),
});
//# sourceMappingURL=cart.schema.js.map