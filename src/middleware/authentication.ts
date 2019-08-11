import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserRoles } from '../config/user';
import { ExtractJwt } from 'passport-jwt';
import { UnauthenticatedError, UnauthorizedError } from '../lib/errors';
import { AuthenticationService } from '../services/authentication-service';
import { User, UserModel } from '../models/user-model';
import { Context } from './context';

const authService = new AuthenticationService();

/**
 * Authenticated request instance. 
 */
export interface AuthRequest extends Request {
  context: Context;
  authToken: string;
  device: any;
}

/**
 * Authenticated response instance. 
 */
export interface AuthResponse extends Response {
  responseData: any;
  send: any;
  return(status: number, data: Object, meta?: Object): void;
}

/**
 * Middleware that authenticates user's request based on JWT token.
 * @param roles Allowed user's roles.
 */
export function authenticateRequest(roles?: UserRoles[]): RequestHandler {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!authToken) {
      return next(new UnauthenticatedError('Authentication token is missing.'));
    }
    
    const userId = authService.parseAuthToken(authToken);
    if (!userId) {
      return next(new UnauthenticatedError('Authentication token is invalid.'));
    }

    let user: UserModel = null;
    try {
      user = await User.findById(userId);
    } catch (error) {
      return next(error);
    }

    if (!user) {
      return next(new UnauthenticatedError('User doesn\'t exists.'));
    }

    /* Check if user has required roles. */
    if (roles && roles.length > 0 && !user.roles.some((role) => roles.indexOf(role) >= 0)) {
      return next(new UnauthorizedError('User doesn\'t have required role.'));
    }

    /* User is authenticated and authorized. */
    req.context.user = user;
    req.authToken = authToken;

    next();
  };
}
