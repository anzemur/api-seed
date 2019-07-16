/**
 * Rate limit by types.
 */
export enum RateLimitByType {
  USER = 0,
  IP = 1,
}

/**
 * Environment types.
 */
export enum EnvType {
  DEV = 'dev',
  PRODUCTION = 'production',
  TEST = 'test',
}

/**
 * Passport authorization strategy types.
 */
export enum PassportAuthStrategyType {
  FACEBOOK = 'facebook-token',
  GOOGLE = 'google-token',
}
