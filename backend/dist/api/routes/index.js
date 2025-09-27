"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/api/routes/index.ts
const express_1 = require("express");
const health_1 = __importDefault(require("./health"));
const auth_1 = __importDefault(require("./auth"));
const products_1 = __importDefault(require("./products"));
const categories_1 = __importDefault(require("./categories"));
const cart_1 = __importDefault(require("./cart"));
const orders_1 = __importDefault(require("./orders"));
const reviews_1 = __importDefault(require("./reviews"));
const router = (0, express_1.Router)();
router.use('/health', health_1.default);
router.use('/auth', auth_1.default);
router.use('/products', products_1.default);
router.use('/categories', categories_1.default);
router.use('/cart', cart_1.default);
router.use('/orders', orders_1.default);
router.use('/reviews', reviews_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map