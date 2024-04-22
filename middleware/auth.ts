import jwt from 'jsonwebtoken';
import asyncHandler from './async';
import ErrorResponse from '../utils/errorResponse';
import UserModel, { User } from '../models/User';
import { Request, Response, NextFunction } from 'express';

// Protect routes
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  
  next();

  let token: string = '';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    //req.user = await UserModel.findById(decoded.id) as User;

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
    /*if (!roles.includes(req.user!.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user!.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();*/
  };
};