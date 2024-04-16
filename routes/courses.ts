import express, { Router } from 'express';
import {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courses';

import Course from '../models/Course';

const router: Router = express.Router({ mergeParams: true });

import advancedResults from '../middleware/advancedResults';
import { protect, authorize } from '../middleware/auth';

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), addCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

export default router;