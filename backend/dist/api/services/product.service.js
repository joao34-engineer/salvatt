"use strict";
// src/api/services/product.service.ts
// Business logic for product operations including pagination and filtering.
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const prisma_1 = require("../../config/prisma");
async function listProducts(params) {
    const where = params.categoryId ? { categoryId: params.categoryId } : {};
    const [items, total] = await Promise.all([
        prisma_1.prisma.product.findMany({ where, skip: params.skip, take: params.take, orderBy: { createdAt: 'desc' } }),
        prisma_1.prisma.product.count({ where }),
    ]);
    return { items, total };
}
function getProductById(id) {
    return prisma_1.prisma.product.findUnique({ where: { id } });
}
function createProduct(data) {
    return prisma_1.prisma.product.create({ data });
}
function updateProduct(id, data) {
    return prisma_1.prisma.product.update({ where: { id }, data });
}
function deleteProduct(id) {
    return prisma_1.prisma.product.delete({ where: { id } });
}
//# sourceMappingURL=product.service.js.map