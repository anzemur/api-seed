import { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import device from 'express-device';
import { AuthRequest, AuthResponse } from './authentication';
import { NextFunction } from 'connect';

/**
 * Registers CORS middleware.
 * @param app Application instance.
 */
export function registerCors(app: Application) {
  app.use(cors());
}

/**
 * Registers requests body parser middleware.
 * @param app Application instance.
 */
export function registerBodyParsers(app: Application) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
}

/**
 * Registers client device parser middleware.
 * @param app Application instance.
 */
export function registerDeviceParsers(app: Application) {
  app.use(device.capture());
}

/**
 * Parses response into correct format.
 * @param req Express request instance.
 * @param res Express response instance.
 * @param next Express next function instance.
 */
export function parseResponse(req: AuthRequest, res: AuthResponse, next: NextFunction) {
  res.return = (status: number, data: any, meta?: Object) => {
    const returnData = meta ? { data, meta } : data;
    res.status(status).json(returnData);
  };
  next();
}

