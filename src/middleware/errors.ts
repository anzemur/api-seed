import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, UnauthenticatedError, InternalServerError, BadRequestError, ConflictError, ValidationError, RateLimitExceededError, InternalOAuthError } from '../lib/errors';
import { isJsonString } from '../lib/validators';

/**
 * Not found error handling middleware.
 * @param req Express request instance.
 * @param res Express response instance.
 */
export function handleNotFoundError(req: Request, res: Response): void {
  res.status(404).json({
    status: 404,
    message: 'Route not found.',
    ...req.method ? { request: req.method } : {},
    ...req.path ? { path: req.path } : {}
  });
}

/**
 * Error handling middleware.
 * @param error Thrown error.
 * @param req Express request instance.
 * @param res Express response instance.
 * @param next Express next function.
 */
export function handleErrors(error: any, req: Request, res: Response, next: NextFunction) {
  if (process.env.ENV === 'dev') {
    console.log(error);
  }

  if (error instanceof UnauthorizedError || error instanceof UnauthenticatedError || error instanceof BadRequestError || error instanceof RateLimitExceededError) {
    res.status(error.status).json({
      status: error.status,
      name: error.name,
      ...error.message ? { message: error.message } : {},
    });
  } else if (error instanceof InternalServerError) {
    res.status(error.status).json({
      status: error.status,
      name: error.name,
      ...error.message ? { message: error.message } : {},
      ...error.error && process.env.ENV === 'dev' ? { error: error.error } : {},
    });
  } else if (error instanceof ConflictError) {
    res.status(error.status).json({
      status: error.status,
      name: error.name,
      ...error.message ? { message: error.message } : {},
      conflicts: error.conflicts
    });
  } else if (error instanceof ValidationError) {
      res.status(error.status).json({
        status: error.status,
        name: error.name,
        ...error.message ? { message: error.message } : {},
        ...error.errors.length ? { errors: error.errors } : {}
      });
  } else if (error instanceof InternalOAuthError) {
    res.status(error.status).json({
      status: error.status,
      name: error.name,
      ...error.message ? { message: error.message } : {},
      ...error.data ? (isJsonString(error.data) ? { data: JSON.parse(error.data) } : { data: error.data }) : {}
    });
  } else {
    res.status(error.status || 500).json({
      status: error.status || 500,
      message: 'Unhandled internal server error.',
      ...process.env.ENV === 'dev' ? { error } : {},
    });
  }
  next();
}
