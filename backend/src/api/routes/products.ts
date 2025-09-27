// src/api/routes/products.ts
import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validateBody, validateParams, validateQuery } from '../../middlewares/validate';
import { authenticate, isAdmin } from '../../middlewares/auth';
import {
  productIdParamSchema,
  listProductsQuerySchema,
  createProductSchema,
  updateProductSchema,
} from '../validators/product.schema';

const router = Router();

// Public endpoints
router.get('/', validateQuery(listProductsQuerySchema), productController.list);
router.get('/:id', validateParams(productIdParamSchema), productController.getById);

// Admin-only endpoints
router.post('/', authenticate, isAdmin, validateBody(createProductSchema), productController.create);
router.put('/:id', authenticate, isAdmin, validateParams(productIdParamSchema), validateBody(updateProductSchema), productController.update);
router.delete('/:id', authenticate, isAdmin, validateParams(productIdParamSchema), productController.remove);

export default router;
