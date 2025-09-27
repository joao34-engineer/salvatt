"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewSchema = void 0;
// src/api/validators/review.schema.ts
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid(),
    rating: zod_1.z.coerce.number().int().min(1).max(5),
    comment: zod_1.z.string().max(5000).optional(),
});
//# sourceMappingURL=review.schema.js.map