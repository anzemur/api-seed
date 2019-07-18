import { NextFunction } from 'express';
import { AuthRequest, AuthResponse } from './authentication';
import { RequestHandler } from 'express-serve-static-core';

/**
 * Response interceptor.
 * @param req Express request instance.
 * @param res Express response instance.
 * @param next Express next function instance.
 */
export function responseInterceptor(req: AuthRequest, res: AuthResponse, next: NextFunction) {
  next();
}

export function createReturn(): RequestHandler {
  return (req: AuthRequest, res: AuthResponse, next: NextFunction) => {
    res.return = (status: number, data: Object, meta?: Object) => {
      res.status(status).json({
        ...data,
        meta
      });
    };
    next();
  };
}

