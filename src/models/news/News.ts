import * as mongoose from 'mongoose';
import { model, Model, Schema } from 'mongoose';
import { CategoryModel } from '../categories';

export interface NewsModel extends mongoose.Document {
  category: CategoryModel,
  slug: String
  title: String,
  author: String,
  image: String,
  body: String
  creationDate: Date,
  lastUpdateDate?: Date,
  tags?: Array<String>,
}

const NewsSchema: Schema = new Schema({
    category: {
      type: new mongoose.Schema({
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        key: {
          type: String,
          required: true
        },
        en: {
          type: String,
          required: true
        },
        ro: {
          type: String,
          required: true
        },
        ru: {
          type: String,
          required: true
        }
      }),
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      required: true,
      type: String
    },
    author: {
      required: true,
      type: String
    },
    image: {
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
      default: Date.now
    },
    lastUpdateDate: {
      required: false,
      type: Date
    },
    tags: {
      type: Array,
      required: false
    }
  },
  {
    versionKey: false
  }
);

export const News: Model<NewsModel> = model('News', NewsSchema);
