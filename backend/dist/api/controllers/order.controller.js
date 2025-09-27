"use strict";
// src/api/controllers/order.controller.ts
// Controllers for order endpoints: create from cart, list by role, get by id, admin update status.
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
exports.updateStatus = exports.getById = exports.list = exports.create = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const orderService = __importStar(require("../services/order.service"));
exports.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const order = await orderService.createOrderFromCart(req.user.id);
    res.status(201).json(order);
});
exports.list = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const orders = await orderService.listOrders(req.user.id, req.user.role);
    res.json(orders);
});
exports.getById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const order = await orderService.getOrderById(id, req.user.id, req.user.role);
    res.json(order);
});
exports.updateStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await orderService.updateOrderStatus(id, status);
    res.json(updated);
});
//# sourceMappingURL=order.controller.js.map