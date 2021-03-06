import * as Joi from 'joi';

/**
 * User update body schema.
 */
export const updateUserSchema = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
}).required();

/**
 * User roles update body schema.
 */
export const updateUserRolesSchema = Joi.object().keys({
  roles: Joi.array().required(),
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

/**
 * Change email request body schema.
 */
export const changeEmailRequestSchema = Joi.object().keys({
  email: Joi.string().email().required(),
}).required();

/**
 * Change email body schema.
 */
export const changeEmailSchema = Joi.object().keys({
  changeEmailToken: Joi.string().required(),
}).required();

/**
 * Change username request body schema.
 */
export const changeUsernameRequestSchema = Joi.object().keys({
  username: Joi.string().required(),
}).required();

/**
 * Change username body schema.
 */
export const changeUsernameSchema = Joi.object().keys({
  changeUsernameToken: Joi.string().required(),
}).required();
