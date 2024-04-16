/**
 * @description middleware
 */
import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction): void => {
    console.log('miao');
    next();
};

export default logger;