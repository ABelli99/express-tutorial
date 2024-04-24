import express, { Router } from 'express';
import {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} from '../controllers/CourseController';

import Course from '../models/CourseModel';

const router: Router = express.Router({ mergeParams: true });

import advancedResults from '../middleware/advancedResults';
import { protect, authorize } from '../middleware/auth';

router
  .route('/')
  .get(getCourses)
  .post(addCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

export default router;