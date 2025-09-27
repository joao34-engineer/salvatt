"use strict";
// src/api/controllers/product.controller.ts
// Express controllers for product endpoints.
// Public: list, get by id. Admin: create, update, delete.
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
exports.remove = exports.update = exports.create = exports.getById = exports.list = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const productService = __importStar(require("../services/product.service"));
const pagination_1 = require("../../utils/pagination");
const httpError_1 = require("../../utils/httpError");
exports.list = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { skip, take } = (0, pagination_1.getPagination)(req.query);
    const { categoryId } = req.query;
    const data = await productService.listProducts({ skip, take, categoryId });
    res.json({
        items: data.items,
        total: data.total,
        pageSize: take,
    });
});
exports.getById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product)
        throw new httpError_1.HttpError(404, 'Product not found');
    res.json(product);
});
exports.create = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const created = await productService.createProduct(req.body);
    res.status(201).json(created);
});
exports.update = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const updated = await productService.updateProduct(id, req.body);
    res.json(updated);
});
exports.remove = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(204).send();
});
//# sourceMappingURL=product.controller.js.map