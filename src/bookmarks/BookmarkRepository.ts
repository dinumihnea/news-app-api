import { Bookmark, BookmarkModel } from './Bookmark';
import { StoredCollection } from '../repositories/StoredCollection';

export default class BookmarkRepository implements StoredCollection<BookmarkModel> {

  constructor() {
    this.save = this.save.bind(this);
  }

  async save(category: BookmarkModel): Promise<BookmarkModel> {
    try {
      return await category.save();
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll(limit: number, offset: number): Promise<Array<BookmarkModel>> {
    try {
      return await Bookmark.find()
        .sort({ creationDate: -1 })
        .skip(offset)
        .limit(limit)
        .populate('news', '-body');
    } catch (e) {
      throw new Error(e);
    }
  }

  async findById(_id: String): Promise<BookmarkModel> {
    try {
      return await Bookmark.findById(_id);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(key: String): Promise<BookmarkModel> {
    try {
      return await Bookmark.findOne({ key });
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(model: BookmarkModel): Promise<any> {
    try {
      return await model.updateOne({ $set: { model } });
    } catch (e) {
      throw new Error(e);
    }
  }

  async delete(key: String): Promise<any> {
    try {
      return await Bookmark.deleteOne({ key: key });
    } catch (e) {
      throw new Error(e);
    }
  }

}
