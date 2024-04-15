import { Request, Response } from 'express';
import User from '../models/User';

export interface AdvRequest extends Request
{
    user: User;
    files: any;
}

export interface AdvResponse extends Response{
  advancedResults: any;
}