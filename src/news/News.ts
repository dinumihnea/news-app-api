import { TagModel } from '../tags/Tag';
import * as mongoose from 'mongoose';
import { model, Model, Schema } from 'mongoose';

export interface NewsModel extends mongoose.Document {
  title: String,
  author: String,
  body: String
  creationDate: Date,
  lastUpdateDate?: Date,
  tags?: Array<TagModel>
}

const NewsSchema: Schema = new Schema({
  title: {
    required: true,
    type: String
  },
  author: {
    required: true,
    type: String
  },
  body: {
    required: true,
    type: String
  },
  creationDate: {
    required: true,
    type: Date,
    default: new Date()
  },
  lastUpdateDate: {
    required: false,
    type: Date
  },
  tags: {
    required: false,
    type: Array
  },
});

export const News: Model<NewsModel> = model('News', NewsSchema);
