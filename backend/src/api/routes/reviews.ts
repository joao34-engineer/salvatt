// src/api/routes/reviews.ts
import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';
import { createReviewSchema } from '../validators/review.schema';

const router = Router();

router.post('/', authenticate, validateBody(createReviewSchema), reviewController.create);

export default router;
