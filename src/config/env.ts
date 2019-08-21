import { config } from 'dotenv';

/* Read env variables. */
config();

/**
 * Type checked list of environment variables.
 */
export default {
  ENV                  : process.env.ENV as string,
  JWT_SECRET           : process.env.JWT_SECRET as string,
  DB_HOST              : process.env.DB_HOST as string,
  DB_NAME              : process.env.DB_NAME as string,
  REDIS_HOST           : process.env.REDIS_HOST as string,
  REDIS_PORT           : parseInt(process.env.REDIS_PORT) as number,
  PORT                 : parseInt(process.env.PORT) as number,
  API_VERSION          : process.env.API_VERSION as string,
  SMTP_HOST            : process.env.SMTP_HOST as string,
  SMTP_PORT            : parseInt(process.env.SMTP_PORT) as number,
  SMTP_USE_SSL         : (process.env.SMTP_USE_SSL !== 'false') as boolean,
  SMTP_USERNAME        : process.env.SMTP_USERNAME as string,
  SMTP_PASSWORD        : process.env.SMTP_PASSWORD as string,
  APP_URL              : process.env.APP_URL as string, 
  FB_CLIENT_ID         : process.env.FB_CLIENT_ID as string,
  FB_CLIENT_SECRET     : process.env.FB_CLIENT_SECRET as string,
  GOOGLE_CLIENT_ID     : process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET as string,
  USE_ADMIN_CONSOLE    : (process.env.USE_ADMIN_CONSOLE !== 'false') as boolean,
};
