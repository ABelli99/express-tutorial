import express, { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/users';

import User from '../models/User';

import { protect, authorize } from '../middleware/auth';
import advancedResults from '../middleware/advancedResults';

const router: Router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;