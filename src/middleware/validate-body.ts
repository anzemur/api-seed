import { RequestHandler } from 'express';
import { AuthRequest, AuthResponse } from './authentication';
import { NextFunction } from 'connect';
import { isRequestBodyEmpty } from '../lib/validators';
import { BadRequestError, ValidationError } from '../lib/errors';
import * as Joi from 'joi';

/**
 * Middleware that validates request body against provided body schema.
 * @param bodySchema Joi schema validation object.
 */
export function validateBody(bodySchema: Joi.ObjectSchema): RequestHandler {
  return async (req: AuthRequest, res: AuthResponse, next: NextFunction) => {
    const body = req.body;

    if (isRequestBodyEmpty(body)) {
      return next(new BadRequestError('Request body is empty.'));
    }

    const { error } = Joi.validate(body, bodySchema, { abortEarly: false });
    if (error) {
      return next(new ValidationError('Request body validation failed.', error));
    }
    next();
  };
}
