import I18nUtils from '../Utils';

describe('translate', () => {
  it('should return the default en value if lang is not a valid I18n.Language enum value', () => {
    expect(I18nUtils.translate(null, 'en', 'ro', 'ru')).toBe('en');
  });

  it('should return the default en value if given lang is en', () => {
    expect(I18nUtils.translate('en', 'en', 'ro', 'ru')).toBe('en');
  });

  it('should return the default ro value if given lang is ro', () => {
    expect(I18nUtils.translate('ro', 'en', 'ro', 'ru')).toBe('ro');
  });

  it('should return the default ru value if given lang is ru', () => {
    expect(I18nUtils.translate('ru', 'en', 'ro', 'ru')).toBe('ru');
  });
});
