"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = listCategories;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
// src/api/services/category.service.ts
const prisma_1 = require("../../config/prisma");
function listCategories() {
    return prisma_1.prisma.category.findMany({ orderBy: { name: 'asc' } });
}
function createCategory(data) {
    return prisma_1.prisma.category.create({ data });
}
function updateCategory(id, data) {
    return prisma_1.prisma.category.update({ where: { id }, data });
}
//# sourceMappingURL=category.service.js.map