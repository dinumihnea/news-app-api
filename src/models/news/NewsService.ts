import NewsRepository from './NewsRepository';
import CategoryService from '../categories/CategoryService';
import { Tag } from '../tags';
import TagService from '../tags/TagService';
import { News, NewsModel } from './News';
import Helpers from '../../utils/Helpers';
import * as mongoose from 'mongoose';

export default class NewsService implements NewsRepository {

  private categoryService = new CategoryService();
  private tagService = new TagService();

  delete = async (_id: String): Promise<any> => {
    try {
      return await News.deleteOne({ _id });
    } catch (e) {
      throw new Error(e);
    }
  };

  findAll = async (limit: number, offset: number): Promise<Array<NewsModel>> => {
    try {
      return await News.find()
        .sort({ creationDate: -1 })
        .skip(offset)
        .limit(limit)
        .select('-body');
    } catch (e) {
      throw new Error(e);
    }
  };

  findById = async (_id: String): Promise<NewsModel> => {
    try {
      return await News.findById(_id);
    } catch (e) {
      throw new Error(e);
    }
  };

  findOne = async (key: String): Promise<NewsModel> => {
    try {
      if (mongoose.Types.ObjectId.isValid(key as string)) {
        // Find by id if key is match by type
        return await this.findById(key);
      } else {
        // Find by slug
        return await this.findBySlug(key);
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  save = async (draftNews: NewsModel): Promise<NewsModel> => {
    const category = await this.categoryService.findOne(draftNews.category.key);
    if (!category) {
      throw new Error('The given news category does not exist');
    } else {
      draftNews.category = category;
    }

    try {
      draftNews.slug = await this.generateSlug(draftNews.title);
      draftNews.tags = await this.validateTags(draftNews.tags);
      return await draftNews.save();
    } catch (e) {
      throw new Error(e);
    }
  };

  update = async (model: NewsModel): Promise<any> => {
    let news = await this.findById(model._id);
    if (!news) {
      throw new Error('News with given identifiers does not exist');
    }

    try {
      return await news.updateOne({ $set: model }, { new: true });
    } catch (e) {
      throw new Error(e);
    }
  };

  findByTag = async (key: String, limit: number, offset: number): Promise<Array<NewsModel>> => {
    try {
      return await News
        .find({ tags: { $in: key } })
        .sort({ creationDate: -1 })
        .skip(offset)
        .limit(limit)
        .select('-body');
    } catch (e) {
      throw new Error(e);
    }
  };

  findByCategory = async (key: String, limit: number, offset: number): Promise<Array<NewsModel>> => {
    try {
      // Check type of key
      if (mongoose.Types.ObjectId.isValid(key as string)) {
        // Search by category._id if key is an ObjectID
        return await News
          .find({ 'category._id': key })
          .sort({ creationDate: -1 })
          .skip(offset)
          .limit(limit)
          .select('-body');
      } else {
        // Search by category.key match
        return await News
          .find({ 'category.key': key })
          .sort({ creationDate: -1 })
          .skip(offset)
          .limit(limit)
          .select('-body');
      }
    } catch (e) {
      throw new Error(e);
    }
  };

  validateTags = async (tags: Array<String>): Promise<Array<String>> => {
    const tagModels = [];
    try {
      for (let key of tags) {
        let tag = await this.tagService.findOne(key);
        if (!tag) {
          // Create tag if not exists yet
          tag = await this.tagService.save(new Tag({ key }));
        }
        tagModels.push(tag.key);
      }
    } catch (e) {
      throw new Error(e);
    }
    return tagModels;
  };

  generateSlug = async (title: String): Promise<String> => {
    let slug = Helpers.slugify(title);
    const news = await this.findOne(slug);
    if (news) {
      // Append now date if this slug already exists
      slug += `-${Date.now().toString(16)}`;
    }
    return slug;
  };

  findBySlug = async (slug: String): Promise<NewsModel> => {
    try {
      return await News.findOne({ slug });
    } catch (e) {
      throw new Error(e);
    }
  };

  findByIdIn = async (ids: Array<String>, limit: number, offset: number): Promise<Array<NewsModel>> => {
    try {
      return await News.find({
        _id: {
          $in: ids
        }
      }).skip(offset)
        .limit(limit).select('-body');
    } catch (e) {
      throw new Error(e);
    }
  };


}
