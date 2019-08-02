/**
 * I18n variants
 */
export type Languages =
// English
  'en' |
  // Romanian
  'ro' |
  // Russian
  'ru';

/**
 * I18n
 */
export interface I18n<Model> {

  /**
   * Returns a new object with translated fields
   * @param model - the model to be translated
   * @param lang - targeted language
   */
  translate(model: Model, lang: String): any

  /**
   * Returns a new object with translated fields
   * @param models - array of models to be translated
   * @param lang - targeted language
   */
  translateAll(models: Array<Model>, lang: String): Array<any>;

}
