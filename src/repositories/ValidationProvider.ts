/**
 * Represents validations for given Model type
 */
export default interface ValidationProvider<Model> {
  /**
   * Checks the given model to be valid
   * @param model - the model to be checked
   */
  isValid(model: Model): boolean;
}
