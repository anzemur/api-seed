import { ObjectId } from 'mongodb';
import { UserModel } from '../models/user-model';
import { AuthRequest } from './authentication';
import { NextFunction, Response, RequestHandler } from 'express';
import { AdminConfigModel } from '../models/admin-config-model';
import { AdminService } from '../services/admin-service';
import { Connection } from 'mongoose';
import { RedisClient } from 'redis';
import { InternalServerError } from '../lib/errors';

const adminService = new AdminService();

/**
 * Additional request context.
 */
export class Context {
  public id: ObjectId;
  public user: UserModel;
  public adminConfig: AdminConfigModel;
  public mongooseConnection: Connection;
  public redisClient: RedisClient;

  constructor() {
    this.id = new ObjectId();
    this.user = null;
    this.adminConfig = null;
    this.mongooseConnection = null;
    this.redisClient = null;
  }
}

/**
 * Context middleware that adds request context to the request.
 * @param req Express request instance.
 * @param res Express response instance.
 * @param next Express next function instance.
 */
export function registerContext(mongooseConnection: Connection, redisClient: RedisClient): RequestHandler {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    req.context = new Context();

    /* Load admin config from db. */
    const { config, error } = await adminService.getAdminConfig();
    if (config) {
      req.context.adminConfig = config;
    }

    if (!req.context.adminConfig)
      next(error ? error : new InternalServerError('There was a problem while loading admin config. Please try again.'));
    
    req.context.mongooseConnection = mongooseConnection;
    req.context.redisClient = redisClient;
    next();
  };
}
