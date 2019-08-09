import * as mongoose from 'mongoose';
import { Model, model, Schema } from 'mongoose';

export interface UserModel extends mongoose.Document {
  username: String;
  email: String;
  password: String,
  firstName?: String;
  lastName?: String;
  bookmarks?: Array<any>;
  createdAt?: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      maxlength: 255
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: false
    },
    lastName: {
      type: String,
      required: false
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
