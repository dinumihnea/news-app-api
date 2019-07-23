import * as mongoose from 'mongoose';
import { Model, model, Schema } from 'mongoose';

export interface TagModel extends mongoose.Document {
  name: String;
  createdAt: Date;
}

const TagSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
});

export const Tag: Model<TagModel> = model('Tag', TagSchema);
