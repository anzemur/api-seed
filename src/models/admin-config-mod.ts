import { Model } from './mod';
import { prop } from 'typegoose';
import { RateLimitConfig } from '../middleware/rate-limit';

/**
 * Admin rate limiting interface.
 */
interface AdminRateLimitConfig extends RateLimitConfig {
  allowRateLimit: boolean;
}

/**
 * Admin config model class.
 */
export class AdminConfigModel extends Model {

  @prop({ required: true })
  rateLimit: AdminRateLimitConfig;

  @prop({ required: true })
  cacheExpiration: number;

  @prop({ required: true, default: false })
  cachePerUser: boolean;

  @prop({ required: true, default: true })
  allowFacebookAuth: boolean;

  @prop({ required: true, default: true })
  allowGoogleAuth: boolean;
}

export const AdminConfig = new AdminConfigModel().getModelForClass(
  AdminConfigModel,
  {
    schemaOptions: {
      ...Model.schemaOptions,
      capped: {
        max: 1,
      }
    }
  }
);
