import * as Joi from 'joi';

/**
 * User registration request body schema.
 */
export const registrationRequestSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
}).required();

/**
 * Change password request body schema.
 */
export const changePasswordSchema = Joi.object().keys({
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  newPassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
}).required();
