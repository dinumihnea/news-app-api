import { NewsModel } from './News';
import { Repository } from '../../repositories/Repository';

export default interface NewsRepository extends Repository<NewsModel> {

  /**
   * Finds news which match given slug
   * @param slug - the slug key to be find
   */
  findBySlug(slug: String): Promise<NewsModel>;

  /**
   * Finds news which contains given Tag key
   * @param key - the Tag key to be find
   * @param limit - the max number of returned elements in array
   * @param offset - the count of elements to skip
   */
  findByTag(key: String, limit: number, offset: number): Promise<Array<NewsModel>>;

  /**
   * Finds news which match the given category key
   * @param key - the Category identifier, can by _id or key
   * @param limit - the max number of returned elements in array
   * @param offset - the count of elements to skip
   */
  findByCategory(key: String, limit: number, offset: number): Promise<Array<NewsModel>>;

  /**
   * Checks if given tags exists and creates if is not
   * @param tags - the news tags to be validated
   */
  validateTags(tags: Array<String>): Promise<Array<String>>;

  /**
   * Transforms given title into a slug
   * @param title - the string to be transformed
   */
  generateSlug(title: String): Promise<String>;

  /**
   * Finds newses by given ids
   * @param ids - an array with news id,
   * @param limit - the max number of items
   * @param offset - the start point of pagination
   */
  findByIdIn(ids: Array<String>, limit: number, offset: number): Promise<Array<NewsModel>>;

}
