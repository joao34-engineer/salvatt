// src/api/routes/orders.ts
import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate, isAdmin } from '../../middlewares/auth';
import { validateBody, validateParams } from '../../middlewares/validate';
import { orderIdParamSchema, updateOrderStatusSchema } from '../validators/order.schema';

const router = Router();

router.post('/', authenticate, orderController.create);
router.get('/', authenticate, orderController.list);
router.get('/:id', authenticate, validateParams(orderIdParamSchema), orderController.getById);
router.put('/:id/status', authenticate, isAdmin, validateParams(orderIdParamSchema), validateBody(updateOrderStatusSchema), orderController.updateStatus);

export default router;
