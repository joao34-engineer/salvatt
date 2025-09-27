"use strict";
// src/api/controllers/cart.controller.ts
// Controllers for cart endpoints. All routes are protected and operate on the current user.
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
exports.removeItem = exports.updateItem = exports.addItem = exports.getCart = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const cartService = __importStar(require("../services/cart.service"));
exports.getCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cart = await cartService.getCart(req.user.id);
    res.json(cart);
});
exports.addItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const cart = await cartService.addItem(req.user.id, req.body);
    res.status(201).json(cart);
});
exports.updateItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { productId } = req.params;
    const cart = await cartService.updateItem(req.user.id, productId, req.body.quantity);
    res.json(cart);
});
exports.removeItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { productId } = req.params;
    const cart = await cartService.removeItem(req.user.id, productId);
    res.json(cart);
});
//# sourceMappingURL=cart.controller.js.map