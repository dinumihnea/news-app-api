import * as mongoose from 'mongoose';
import { Model, model, Schema } from 'mongoose';

export interface UserModel extends mongoose.Document {
  email: String;
  password?: String,
  firstName?: String;
  lastName?: String;
  bookmarks?: Array<any>;
  createdAt?: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255
    },
    firstName: {
      type: String,
      required: false,
      maxlength: 255
    },
    lastName: {
      type: String,
      required: false,
      maxlength: 255
    },
    bookmarks: {
      type: Array,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

export const User: Model<UserModel> = model('User', UserSchema);
