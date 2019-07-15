import { Model } from './model';
import { UserStatus, UserRoles } from '../config/user';
import { prop } from 'typegoose';

export class UserModel extends Model {

  @prop({ required: true, unique: true })
  username: string;

  @prop({ required: true, unique: true })
  email: string;

  @prop()
  password: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true, enum: UserStatus, default: 1})
  status: UserStatus;

  @prop({required: true })
  roles: UserRoles[];

  @prop()
  fbId: string;
}

export const User = new UserModel().getModelForClass(UserModel, { schemaOptions: Model.schemaOptions });
