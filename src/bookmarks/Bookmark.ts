import * as mongoose from 'mongoose';
import { Model, model, Schema } from 'mongoose';

export interface BookmarkModel extends mongoose.Document {
  newsId: String
  userId: String
  createdAt?: Date;
}

const BookmarkSchema: Schema = new Schema({
  newsId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  }
});

export const Bookmark: Model<BookmarkModel> = model('Bookmark', BookmarkSchema);
