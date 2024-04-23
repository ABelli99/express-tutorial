import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/errorResponse';
import asyncHandler from '../middleware/async';
import UserModel, {User} from '../models/User';
import { UserService, QueryOptions } from '../services/Users';
import { UserDTO } from '../DTO/UserDTO';


// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin
export const getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {pageSize, pageNumber, sort} = req.body;

  let query = req.body.query;
  const queryOptions: QueryOptions = {pageSize: pageSize, pageNumber: pageNumber, sort: sort};

  const service = new UserService();

  const result: User[] = await service.find(query, queryOptions);
  if (!result) {
    return res.status(404).send("No Users founded!");
  }

  

  let body:any = result;

  body.push("pageSize", pageSize)
  body.push("pageNumber", pageNumber);
  body.push("maxItems", await service.totalEntries(query, queryOptions));


  

  res.status(200).send(body);
});

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/Admin
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`No user with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private/Admin
export const createUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const user = await UserModel.create(req.body as UserDTO);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body as UserDTO, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  
  await UserModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});