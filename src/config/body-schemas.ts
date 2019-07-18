import * as Joi from 'joi';

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
