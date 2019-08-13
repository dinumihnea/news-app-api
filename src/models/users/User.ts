import * as mongoose from 'mongoose';
import { Model, model, Schema } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';
import * as config from 'config';
import { AuthRequest } from '../../auth/AuthMiddleware';

export type UserRoleType = 'simple' | 'moderator' | 'admin';

export interface UserModel extends mongoose.Document {
  email: String;
  password?: String,
  firstName?: String;
  lastName?: String;
  bookmarks?: Array<any>;
  createdAt?: Date;
  role: UserRoleType;

  /**
   * Gets an UserModel valued only with the public field which all users can see
   */
  getPublicFields(): UserModel;

  /**
   * Generates an authorization token which contains an user identifier
   */
  generateAuthToken(): string;
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
    },
    role: {
      type: String,
      required: true,
      default: 'simple'
    }
  },
  {
    versionKey: false
  }
);

UserSchema.methods.generateAuthToken = function (): string {
  return jwt.sign({ _id: this._id, role: this.role }, config.get('jwtPrivateKey'));
};

UserSchema.methods.getPublicFields = function (): AuthRequest {
  return _.pick(this, ['_id', 'email', 'firstName', 'lastName']);
};


export const User: Model<UserModel> = model('User', UserSchema);
