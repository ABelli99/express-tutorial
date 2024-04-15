/**
 * @description middleware
 */
import { NextFunction } from 'express';
import { AdvRequest, AdvResponse } from '../utils/advanceResponse';

const logger = (req: AdvRequest, res: AdvResponse, next: NextFunction): void => {
    console.log('miao');
    next();
};

export default logger;