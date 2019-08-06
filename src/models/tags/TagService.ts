import { Tag, TagModel } from './Tag';
import TagRepository from './TagRepository';

export default class TagService implements TagRepository {

  delete = async (key: String): Promise<any> => {
    try {
      return await Tag.deleteOne({ key });
    } catch (e) {
      throw new Error(e);
    }
  };

  deleteById = async (_id: String): Promise<any> => {
    try {
      return await Tag.deleteOne({ _id });
    } catch (e) {
      throw new Error(e);
    }
  };

  findAll = async (limit: number, offset: number): Promise<Array<TagModel>> => {
    try {
      return await Tag.find()
        .sort({ creationDate: -1 })
        .skip(offset)
        .limit(limit);
    } catch (e) {
      throw new Error(e);
    }
  };

  findById = async (_id: String): Promise<TagModel> => {
    try {
      return await Tag.findById({ _id });
    } catch (e) {
      throw new Error(e);
    }
  };

  findOne = async (key: String): Promise<TagModel> => {
    try {
      return await Tag.findOne({ key });
    } catch (e) {
      throw new Error(e);
    }
  };

  save = async (model: TagModel): Promise<TagModel> => {
    try {
      return await model.save();
    } catch (e) {
      throw new Error(e);
    }
  };

  update = async (model: TagModel): Promise<any> => {
    // Ignored
    // Tag as entity can not be modified - just created an deleted
  }


}
