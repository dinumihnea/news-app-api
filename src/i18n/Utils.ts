import { Language } from './I18n';

export default class I18nUtils {

  public static translate(
    lang: Language,
    en: String,
    ro: String,
    ru: String,
    defaultValue?: String): String {

    defaultValue = defaultValue ? defaultValue : en;
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
