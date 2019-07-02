import { ObjectId } from 'mongodb';
import { UserModel } from '../models/user-model';
import { AuthRequest } from './authentication';
import { NextFunction, Response, RequestHandler } from 'express';
import { AdminConfigModel } from '../models/admin-config-model';
import { AdminService } from '../services/admin-service';
import { Connection } from 'mongoose';

const adminService = new AdminService();

/**
 * Additional request context.
 */
export class Context {
  public id: ObjectId;
  public user: UserModel;
  public adminConfig: AdminConfigModel;
  public mongooseConnection: Connection;

  constructor() {
    this.id = new ObjectId();
    this.user = null;
    this.adminConfig = null;
    this.mongooseConnection = null;
  }
}

/**
 * Context middleware that adds request context to the request.
 * @param req Express request instance.
 * @param res Express response instance.
 * @param next Express next function instance.
 */
export function registerContext(mongooseConnection: Connection): RequestHandler {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    req.context = new Context();
    req.context.adminConfig = await adminService.getAdminConfig();
    req.context.mongooseConnection = mongooseConnection;
    next();
  };
}
