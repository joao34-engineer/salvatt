"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// src/api/routes/cart.ts
const express_1 = require("express");
const cartController = __importStar(require("../controllers/cart.controller"));
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../middlewares/validate");
const cart_schema_1 = require("../validators/cart.schema");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, cartController.getCart);
router.post('/items', auth_1.authenticate, (0, validate_1.validateBody)(cart_schema_1.addCartItemSchema), cartController.addItem);
router.put('/items/:productId', auth_1.authenticate, (0, validate_1.validateParams)(cart_schema_1.productIdParamSchema), (0, validate_1.validateBody)(cart_schema_1.updateCartItemSchema), cartController.updateItem);
router.delete('/items/:productId', auth_1.authenticate, (0, validate_1.validateParams)(cart_schema_1.productIdParamSchema), cartController.removeItem);
exports.default = router;
//# sourceMappingURL=cart.js.map