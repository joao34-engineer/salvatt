// src/api/routes/cart.ts
import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../../middlewares/auth';
import { validateBody, validateParams } from '../../middlewares/validate';
import { addCartItemSchema, productIdParamSchema, updateCartItemSchema } from '../validators/cart.schema';

const router = Router();

router.get('/', authenticate, cartController.getCart);
router.post('/items', authenticate, validateBody(addCartItemSchema), cartController.addItem);
router.put('/items/:productId', authenticate, validateParams(productIdParamSchema), validateBody(updateCartItemSchema), cartController.updateItem);
router.delete('/items/:productId', authenticate, validateParams(productIdParamSchema), cartController.removeItem);

export default router;
