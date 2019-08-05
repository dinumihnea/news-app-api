import * as mongoose from 'mongoose';
import { Model, model, Schema } from 'mongoose';

export interface UserModel extends mongoose.Document {
  username: String;
  email: String;
  firstName?: String;
  lastName?: String;
  bookmarks?: Array<any>
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
      unique: true
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

UserSchema.index({ news: 1, user: 1 }, { unique: true });

export const User: Model<UserModel> = model('User', UserSchema);
