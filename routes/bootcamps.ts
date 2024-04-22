import express, { Router } from 'express';
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} from '../controllers/bootcamps';

import Bootcamp from '../models/Bootcamp';

// Include other resource routers
import courseRouter from './courses';
import reviewRouter from './reviews';

const router: Router = express.Router();

import advancedResults from '../middleware/advancedResults';
import { protect, authorize } from '../middleware/auth';

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(bootcampPhotoUpload);
router
  .route('/')
  .get(getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

export default router;