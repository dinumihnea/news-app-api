import * as mongoose from 'mongoose';
import { Model, model, Schema } from 'mongoose';
import { News } from '../news/News';

export interface BookmarkModel extends mongoose.Document {
  name: string;
  createdAt: Date;
}

const BookmarkSchema: Schema = new Schema({
  user: {
    type: String,
    required: true
  },
  news: {
    required: true,
    type: News
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
});

export const Bookmark: Model<BookmarkModel> = model('Bookmark', BookmarkSchema);
