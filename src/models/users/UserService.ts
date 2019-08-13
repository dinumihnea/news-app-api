import { User, UserModel } from './User';
import UserRepository from './UserRepository';
import { NewsModel } from '../news';
import NewsService from '../news/NewsService';

export default class UserService implements UserRepository {

  private newsService: NewsService = new NewsService();

  constructor() {
    this.findBookmarks = this.findBookmarks.bind(this);
  }

  async checkNews(newsId: String): Promise<NewsModel> {
    try {
      // TODO use this when bookmark functionality wll be implemented
      return await this.newsService.findById(newsId);
    } catch (e) {
      throw new Error(e);
    }
  }

  async save(user: UserModel): Promise<UserModel> {
    try {
      return await user.save();
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll(limit: number, offset: number): Promise<Array<UserModel>> {
    try {
      return await User.find()
        .sort({ creationDate: -1 })
        .skip(offset)
        .limit(limit)
        .select('-password');
    } catch (e) {
      throw new Error(e);
    }
  }

  async findById(_id: String): Promise<UserModel> {
    try {
      return await User.findById(_id)
        .select('-password');
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(email: String): Promise<UserModel> {
    try {
      return await User.findOne({ email })
        .select('-password');
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(model: UserModel): Promise<any> {
    let user = null;
    try {
      user = await User.findById(model._id);
    } catch (e) {
      throw new Error(e);
    }

    if (!user) {
      throw new Error('User does not exists');
    }

    try {
      return await user.updateOne({ $set: { ...model } });
    } catch (e) {
      throw new Error(e);
    }
  }

  async delete(_id: String): Promise<any> {
    try {
      return await User.deleteOne({ _id });
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOneIncludePassword(email: String): Promise<UserModel> {
    try {
      return await User.findOne({ email });
    } catch (e) {
      throw new Error(e);
    }
  }

  async findBookmarks(id: String, limit: number, offset: number): Promise<Array<NewsModel>> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error(`User with id: ${id} does not exist`);
    }

    try {
      const newsesId = user.bookmarks.reverse();
      return await this.newsService.findByIdIn(newsesId, limit, offset);
    } catch (e) {
      throw new Error(e);
    }
  }

}
