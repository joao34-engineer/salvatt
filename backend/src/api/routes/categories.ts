// src/api/routes/categories.ts
import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { validateBody, validateParams } from '../../middlewares/validate';
import { authenticate, isAdmin } from '../../middlewares/auth';
import { categoryIdParamSchema, createCategorySchema, updateCategorySchema } from '../validators/category.schema';

const router = Router();

// Public
router.get('/', categoryController.list);

// Admin-only
router.post('/', authenticate, isAdmin, validateBody(createCategorySchema), categoryController.create);
router.put('/:id', authenticate, isAdmin, validateParams(categoryIdParamSchema), validateBody(updateCategorySchema), categoryController.update);

export default router;
