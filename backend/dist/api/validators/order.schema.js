"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusSchema = exports.orderIdParamSchema = void 0;
// src/api/validators/order.schema.ts
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.orderIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.OrderStatus),
});
//# sourceMappingURL=order.schema.js.map