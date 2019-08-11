import { AuthRequest, AuthResponse } from './authentication';
import { NextFunction } from 'express';
import { Log } from '../models/log-model';
import moment from 'moment';
import logger from '../config/logger';

/**
 * Request logs middleware.
 * @param req Express request instance.
 * @param res Express response instance.
 * @param next Express next function.
 */
export function registerLogs(req: AuthRequest, res: AuthResponse, next: NextFunction) {
  const end = res.end;
  res.end = async function() {
    const startTime = Date.now();
    const args = Array.prototype.slice.apply(arguments);
    end.apply(res, args);

    const log = new Log({
      requestId: req.context.id || '',
      requestUrl: req.originalUrl.split('?')[0] || '',
      fullRequestUrl: req.originalUrl || '',
      statusCode: res.statusCode || 0,
      statusMessage: res.statusMessage || '',
      method: req.method || '',
      ip: req.ip || '',
      host: req.hostname || '',
      httpVersion: req.httpVersion || '',
      protocol: req.protocol || '',
      userId: req.context.user && req.context.user.id ? req.context.user.id : null,
      responseTime: Number(`${Date.now() - startTime}`),
      clientDevice: req.device && req.device.type ? req.device.type : '',
      userAgent: (req.headers && req.headers['user-agent']) ? req.headers['user-agent'] : '',
    });

    logger.http(`Request on ${moment()}`, { request: log });
    
    try {
      await log.save();
    } catch (error) {
      console.log(error);
    }
  };
  next();
}

