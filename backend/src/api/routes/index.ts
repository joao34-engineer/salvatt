// src/api/routes/index.ts
import { Router } from 'express';
import healthRouter from './health';
import authRouter from './auth';
import productsRouter from './products';
import categoriesRouter from './categories';
import cartRouter from './cart';
import ordersRouter from './orders';
import reviewsRouter from './reviews';

const router = Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/products', productsRouter);
router.use('/categories', categoriesRouter);
router.use('/cart', cartRouter);
router.use('/orders', ordersRouter);
router.use('/reviews', reviewsRouter);

export default router;
