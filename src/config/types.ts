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

/**
 * Logger level types.
 */
export enum LoggerLevels {
  debug = 'debug',
  info = 'info',
  http = 'http',
  warn = 'warn',
  error = 'error',
}

/**
 * Mongoose event types.
 */
export enum MongooseEvents {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

/**
 * Redis event types.
 */
export enum RedisEvents {
  CONNECT = 'connect',
  END = 'end',
  ERROR = 'error',
}
