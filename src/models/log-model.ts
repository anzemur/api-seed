import { Model } from './model';
import { prop } from 'typegoose';

export class LogModel extends Model {

  @prop({ required: true })
  requestId: string;

  @prop({ required: true })
  requestUrl: string;

  @prop({ required: true })
  fullRequestUrl: string;

  @prop({ required: true })
  statusCode: number;

  @prop({ required: true })
  statusMessage: string;

  @prop({ required: true })
  method: string;

  @prop({ required: true })
  ip: string;

  @prop({ required: true })
  host: string;

  @prop({ required: true })
  httpVersion: string;

  @prop({ required: true })
  protocol: string;

  @prop()
  userId: string;

  @prop()
  responseTime: number;

  @prop({ required: true })
  clientDevice: string;

  @prop({ required: true })
  userAgent: string;
}

export const Log = new LogModel().getModelForClass(LogModel, { schemaOptions: Model.schemaOptions });
