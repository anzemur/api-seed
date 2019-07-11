import { RequestHandler, Response } from 'express';
import { AuthRequest, AuthResponse } from './authentication';
import { NextFunction } from 'connect';

/**
 * Response caching middleware.
 * If parameters are not provided default values from admin config will be used.
 * @param perUser Tells if cached data should be cached per user. Request must be authenticated.
 * @param expiration Cached data expiration in seconds.
 */
export function registerCache(perUser: boolean = false, expiration?: number): RequestHandler {
  return async (req: AuthRequest, res: AuthResponse, next: NextFunction) => {
    const redisClient = req.context.redisClient;
    const cacheDataExp = expiration || req.context.adminConfig.cacheExpiration;

    let key = req.url;
    if ((perUser || req.context.adminConfig.cachePerUser) && req.context.user && req.context.user.id)  {
      key = `${req.url}_${req.context.user.id}`;
    }

    redisClient.get(key, (err, result) => {
      if (!err && result) {
        res.send(JSON.parse(result));
      } else {
        res.responseData = res.send;
        res.send = (data: any) => {
          redisClient.set(key, data, 'EX', cacheDataExp, (error, reply) => {
            if (reply === 'OK') {
              res.responseData(data);
            }
          });
        };
        next();
      }
    });
  };
}
