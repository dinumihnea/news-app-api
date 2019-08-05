import { Tag, TagModel } from './Tag';
import { Repository } from '../repositories/Repository';

export default class TagService implements Repository<TagModel> {

  constructor() {
    this.save = this.save.bind(this);
  }

  delete(key: String): Promise<any> {
    return undefined;
  }

  async findAll(limit: number, offset: number): Promise<Array<TagModel>> {
    try {
      return await Tag.find()
        .sort({ creationDate: -1 })
        .skip(offset)
        .limit(limit);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findById(_id: String): Promise<TagModel> {
    try {
      return await Tag.findById({ _id });
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(key: String): Promise<TagModel> {
    try {
      return await Tag.findOne({ key });
    } catch (e) {
      throw new Error(e);
    }
  }

  async save(model: TagModel): Promise<TagModel> {
    try {
      return await model.save();
    } catch (e) {
      throw new Error(e);
    }
  }

  update(model: TagModel): Promise<any> {
    return undefined;
  }


}
