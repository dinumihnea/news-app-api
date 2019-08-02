import * as mongoose from 'mongoose';
import { model, Model, Schema } from 'mongoose';

export interface CategoryModel extends mongoose.Document {
  key: String,
  en: String,
  ro: String,
  ru: String,
}

export const CategorySchema: Schema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  en: {
    type: String,
    required: true,
    trim: true
  },
  ro: {
    type: String,
    required: true,
    trim: true
  },
  ru: {
    type: String,
    required: true,
    trim: true
  }
});

export const Category: Model<CategoryModel> = model('Category', CategorySchema);
