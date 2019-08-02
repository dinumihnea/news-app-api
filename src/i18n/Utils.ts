export default class I18nUtils {

  public static translate(
    lang: 'en' | 'ro' | 'ru',
    en: String,
    ro: String,
    ru: String,
    defaultValue?: String): String {

    switch (lang) {
      case 'en': {
        return en;
      }
      case 'ro': {
        return ro;
      }
      case 'ru': {
        return ru;
      }
      default: {
        return defaultValue;
      }
    }
  }

}
