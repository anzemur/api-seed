import { Model } from './model';
import { prop } from 'typegoose';
import { RateLimitConfig } from '../middleware/rate-limit';

export class AdminConfigModel extends Model {
  @prop({ required: true })
  rateLimit: RateLimitConfig;
}

export const AdminConfig = new AdminConfigModel().getModelForClass(
  AdminConfigModel,
  {
    schemaOptions: {
      ...Model.schemaOptions,
      capped: { 
        size: 1024,
        max: 1,
        autoIndexId: true }
    }
  }
);
