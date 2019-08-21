import { AuthRequest } from './authentication';
import { Response, NextFunction, RequestHandler } from 'express';
import { RateLimiterMongo, RateLimiterRes, IRateLimiterMongoOptions } from 'rate-limiter-flexible';
import { RateLimitExceededError } from '../lib/errors';
import { RateLimitByType } from '../config/types';
import { parseDurationFromMs } from '../lib/parsers';


/**
 * Rate limit configuration.
 * `limitBy` - Rate limit by IP address of user ID.
 * `maxPoints` - Maximum number of points that can be consumed over duration.
 * `consumePoints` - Number of points consumed per endpoint.
 * `duration` - Number of seconds before consumed points are reset.
 * `blockDuration` - Number of seconds the user is blocked after consuming all of available points on endpoint.
 */
export interface RateLimitConfig {
  limitBy?: RateLimitByType;
  maxPoints?: number;
  consumePoints?: number;
  duration?: number;
  blockDuration?: number;
}

/**
 * Middleware that registers rate limiting on given route.
 * If `config` is not provided default values from admin configuration will be used.
 * @param config Rate limit configuration object.
 */
export function registerRateLimit(config: RateLimitConfig = {}): RequestHandler {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const defaultRateLimit = req.context.adminConfig.rateLimit;

    /* Check if rate limiting is disabled. */
    if (!defaultRateLimit.allowRateLimit) {
      return next();
    }

    const options: IRateLimiterMongoOptions = {
      storeClient: req.context.mongooseConnection,
      points: config.maxPoints || defaultRateLimit.maxPoints,
      duration: config.duration || defaultRateLimit.duration,
      blockDuration: config.blockDuration || defaultRateLimit.blockDuration,
    };
    
    const limitBy = config.limitBy || defaultRateLimit.limitBy;
    let consumeKey = req.ip;
    if (req.context.user && req.context.user.id && limitBy === RateLimitByType.USER) {
      consumeKey = req.context.user.id;
    }

    const rateLimiterMongo = new RateLimiterMongo(options);
    rateLimiterMongo.consume(consumeKey, config.consumePoints || defaultRateLimit.consumePoints)
      .then((rateLimiterRes) => {
        res.set(getHeaders(rateLimiterRes, options));
        next();
      })
      .catch((rateLimiterRes) => {
        res.set(getHeaders(rateLimiterRes, options));
        if (rateLimiterRes.consumedPoints > options.points && options.blockDuration) {
          return next(new RateLimitExceededError(`Too many sent requests from this ${limitBy === RateLimitByType.USER ? 'user' : 'IP'}. Requesting this endpoint is now blocked for: ${parseDurationFromMs(rateLimiterRes.msBeforeNext)}`));
        } else {
          return next(new RateLimitExceededError(`Too many sent requests from this ${limitBy === RateLimitByType.USER ? 'user' : 'IP'}. Please try again in: ${parseDurationFromMs(rateLimiterRes.msBeforeNext)}`));
        }
      });
  };
}

/**
 * Returns object of headers related to rate limiting response.
 * @param rateLimiterRes Rate limiter response.
 * @param options Rate limiter options.
 */
function getHeaders(rateLimiterRes: RateLimiterRes, options: IRateLimiterMongoOptions) {
  return {
    'Retry-After': rateLimiterRes.msBeforeNext / 1000,
    'X-RateLimit-Limit': options.points,
    'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
    'X-RateLimit-Reset': new Date(Date.now() + rateLimiterRes.msBeforeNext)
  };
}
