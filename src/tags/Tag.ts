import * as mongoose from 'mongoose';
import { Model, model, Schema } from 'mongoose';

export interface TagModel extends mongoose.Document {
  key: String;
  createdAt: Date;
  count?: Number
}

const TagSchema: Schema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  count: {
    type: Number,
    required: true,
    default: 0
  }
});

export const Tag: Model<TagModel> = model('Tag', TagSchema);
