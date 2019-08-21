import { prop, Typegoose } from 'typegoose';
import { SchemaOptions } from 'mongoose';
import { ObjectId } from 'mongodb';

/**
 * Base model class.
 */
export abstract class Model extends Typegoose {

  /* Model schema options. */
  static schemaOptions: SchemaOptions = {
    _id       : true,
    id        : true,
    timestamps: true,
    toObject  : {
      virtuals: true
    },
    toJSON    : {
      virtuals: true
    }
  };

  /* String representation of MongoDb ObjectId. */
  readonly id: string;

  /* MongoDb ObjectId. */
  readonly _id: ObjectId;

  @prop()
  readonly createdAt: Date;

  @prop()
  readonly updatedAt: Date;
}
