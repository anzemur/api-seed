import { NextFunction } from 'express';
import { AuthRequest, AuthResponse } from './authentication';

/**
 * Response interceptor.
 * @param req Express request instance.
 * @param res Express response instance.
 * @param next Express next function instance.
 */
export function responseInterceptor(req: AuthRequest, res: AuthResponse, next: NextFunction) {
  next();
}

export function createReturn(req: AuthRequest, res: AuthResponse, next: NextFunction) {
  res.return = (status: number, data: any, meta?: Object) => {
    const returnData = meta ? { data, meta } : data;
    res.status(status).json(returnData);
  };
  next();
}

