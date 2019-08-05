/**
 * Represents main database operations for given Model type
 */
export interface Repository<Model> {

  /**
   * Save a copy of given model into database
   *
   * If the validation of model schema will not pass
   * an error will be thrown
   *
   * @return saved object as Promise data
   */
  save(model: Model): Promise<Model>;

  /**
   * Gets all models from database
   * @param limit - the max number of items
   * @param offset - the start point of pagination
   * @return an array with all models
   */
  findAll(limit: number, offset: number): Promise<Array<Model>>;

  /**
   * Gets one model by given id.
   * @param _id - the database id of the Model
   */
  findById(_id: String): Promise<Model>;

  /**
   * Gets one model by given key.
   * @param key must be an unique field of Model
   */
  findOne(key: String): Promise<Model>;

  /**
   * Updates the model in database
   * @param model - the model to be updated
   */
  update(model: Model): Promise<any>;

  /**
   * Removes the model from database
   * @param key can be _id, slug or other unique value
   */
  delete(key: String): Promise<any>;

}
