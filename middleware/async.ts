import { NextFunction } from 'express';
import { AdvRequest, AdvResponse } from '../utils/advanceResponse';

const asyncHandler = (fn: Function) => (req: AdvRequest, res: AdvResponse, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;