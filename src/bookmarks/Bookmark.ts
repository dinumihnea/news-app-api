import * as mongoose from 'mongoose';
import { Model, model, Schema } from 'mongoose';
import { NewsModel } from '../news/News';

export interface BookmarkModel extends mongoose.Document {
  news: NewsModel
  // TODO create author model
  user: String
  createdAt?: Date;
}

const BookmarkSchema: Schema = new Schema({
  news: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    required: true
  },
  user: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

BookmarkSchema.index({ news: 1, user: 1 }, { unique: true });

export const Bookmark: Model<BookmarkModel> = model('Bookmark', BookmarkSchema);
