import { ObjectId } from 'mongodb';
import { UserModel } from '../models/user-model';
import { AuthRequest } from './authentication';
import { NextFunction, Response } from 'express';

/**
 * Additional request context.
 */
export class Context {
  public id: ObjectId;
  public user: UserModel;

  constructor() {
    this.id = new ObjectId();
    this.user = null;
  }
}

/**
 * Context middleware that adds request context to the request.
 * @param req Express request instance.
 * @param res Express response instance.
 * @param next Express next function instance.
 */
export function registerContext(req: AuthRequest, res: Response, next: NextFunction): void {
  req.context = new Context();
  next();
}
