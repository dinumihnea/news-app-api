import { UserModel } from './User';
import { Repository } from '../../repositories/Repository';
import { NewsModel } from '../../news/News';

export default interface UserRepository extends Repository<UserModel> {

  /**
   * Checks if the given newsId exists in DB
   * @param newsId - the id to be checked
   */
  checkNews(newsId: String): Promise<NewsModel>

}
