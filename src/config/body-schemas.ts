import * as Joi from 'joi';

/**
 * User update body schema.
 */
export const updateUserSchema = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
}).required();

/**
 * Admin config update body schemas.
 */
export const updateAdminConfigSchema = Joi.object().keys({
    allowGoogleAuth: Joi.boolean(),
    allowFacebookAuth: Joi.boolean(),
    rateLimit: Joi.object().keys({
      limitBy: Joi.number().integer(),
      maxPoints: Joi.number().integer(),
      consumePoints: Joi.number().integer(),
      duration: Joi.number().integer(),
      blockDuration: Joi.number().integer(),
      allowRateLimit: Joi.boolean(),
    }),
    cacheExpiration: Joi.number().integer(),
    cachePerUser: Joi.boolean(),
}).required();

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

/**
 * Forgotten password request body schema.
 */
export const forgottenPasswordSchema = Joi.object().keys({
  email: Joi.string().email().required(),
}).required();

/**
 * Reset password request body schema.
 */
export const resetPasswordSchema = Joi.object().keys({
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  forgottenPasswordToken: Joi.string().required(),
}).required();
