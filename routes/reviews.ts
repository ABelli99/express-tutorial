import express, { Router } from 'express';
import {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} from '../controllers/reviews';

import Review from '../models/Review';

import  advancedResults  from '../middleware/advancedResults';
import { protect, authorize } from '../middleware/auth';

const router: Router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getReviews)
  .post(addReview);

router
  .route('/:id')
  .get(getReview)
  .put(updateReview)
  .delete(deleteReview);

export default router;