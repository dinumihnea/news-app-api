import { UserModel } from './User';
import { Repository } from '../../repositories/Repository';
import { NewsModel } from '../news';

export default interface UserRepository extends Repository<UserModel> {

  /**
   * Checks if the given newsId exists in DB
   * @param newsId - the id to be checked
   */
  checkNews(newsId: String): Promise<boolean>

  /**
   * Searches for user by given identifier and returns whole UserModel include has password field
   * @param id - the user's email
   */
  findOneIncludePassword(id: String): Promise<UserModel>

  /**
   * Finds the list of bookmarked newses for given user id
   * @param id - the user id
   * @param limit - the max number of items
   * @param offset - the start point of pagination
   */
  findBookmarks(id: String, limit: number, offset: number): Promise<Array<NewsModel>>

  /**
   * Checks and saves given newsId as bookmark for given user
   * @param userId - user to be updated
   * @param newsId - the news id to be bookmarked
   */
  saveBookmark(userId: String, newsId: String): Promise<any>

  /**
   * Checks and removes given newsId as bookmark for given user
   * @param userId - user to be updated
   * @param newsId - the news id to be removed from bookmarks
   */
  removeBookmark(userId: String, newsId: String): Promise<any>


}
