import jwt from 'jsonwebtoken';
import { Request, NextFunction } from 'express';
import UserModel, { User } from '../models/UserModel';
import ErrorResponse from '../utils/ErrorResponseUtils';


export async function getUserFromRequest(req: Request, next: NextFunction): Promise<User>{

    let token: string = '';
    let verifiedUser: User;
  
    //checks req headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
    }
  
    //missing tocken
    if (!token) {
      next(new ErrorResponse("Missing bearer token", 401));
    }
  
    //verification
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
  
      verifiedUser = await UserModel.findById(decoded.id) as User;
  
    } catch (err) {
        next(new ErrorResponse("wrong password", 401));
    }

    return verifiedUser!;
  }