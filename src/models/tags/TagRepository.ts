import { Repository } from '../../repositories/Repository';
import { TagModel } from './Tag';

export default interface TagRepository extends Repository<TagModel> {

  /**
   * Removes tag by given database id
   * @param _id the identifier for tag model
   */
  deleteById(_id: String): Promise<any>

}
