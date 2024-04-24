import express, { Router } from 'express';
import {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} from '../controllers/ReviewController';

import Review from '../models/ReviewModel';

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