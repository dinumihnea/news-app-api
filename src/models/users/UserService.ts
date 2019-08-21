import { User, UserModel } from './User';
import UserRepository from './UserRepository';
import { NewsModel } from '../news';
import NewsService from '../news/NewsService';

export default class UserService implements UserRepository {

  private newsService: NewsService = new NewsService();

  constructor() {
    this.findBookmarks = this.findBookmarks.bind(this);
  }

  async checkNews(newsId: String): Promise<boolean> {
    try {
      const news = await this.newsService.findById(newsId);
      return !!(news.id);
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
      throw new Error('User does not exist');
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

  async saveBookmark(userId: String, newsId: String): Promise<any> {
    let user: UserModel = null;
    // Check if user exists
    try {
      user = await User.findById(userId);
    } catch (e) {
      throw new Error(e);
    }
    if (!user) {
      throw new Error('User does not exist');
    }
    // Check if news exists
    const existsNews = await this.checkNews(newsId);
    if (!existsNews) {
      throw new Error('Given newsId does not exist');
    }
    // Check if user already has this bookmark
    const contains = user.bookmarks.includes(newsId);
    if (contains) {
      throw new Error('User already has this newsId as bookmark');
    }
    // Update user in db
    try {
      return await user.updateOne({ bookmarks: [...user.bookmarks, newsId] });
    } catch (e) {
      throw new Error(e);
    }
  }

  async removeBookmark(userId: String, newsId: String): Promise<any> {
    let user: UserModel = null;
    // Check if user exists
    try {
      user = await User.findById(userId);
    } catch (e) {
      throw new Error(e);
    }
    if (!user) {
      throw new Error('User does not exist');
    }
    // Check if news exists
    const existsNews = await this.checkNews(newsId);
    if (!existsNews) {
      throw new Error('Given newsId does not exist');
    }
    // Check if user does not hav this bookmark
    const bookmarkIndex = user.bookmarks.indexOf(newsId);
    if (bookmarkIndex === -1) {
      throw new Error('User does not have given newsId as bookmark');
    }
    // Update user in db
    try {
      user.bookmarks.splice(bookmarkIndex, 1);
      return await user.updateOne({ bookmarks: user.bookmarks });
    } catch (e) {
      throw new Error(e);
    }
  }

}
