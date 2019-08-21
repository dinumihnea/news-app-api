import Helpers from '../Helpers';

describe('helper', () => {
  it('should return false if the given value is falsy', () => {
    const falsy = [null, undefined, NaN, 0, '', [], {}];
    falsy.forEach(value => {
      expect(Helpers.isValidEmail(value as any)).toBe(false);
    });
  });

  it('should return false if the given value does not contains the @ sign', () => {
    const testValue = 'a';
    expect(Helpers.isValidEmail(testValue)).toBe(false);
  });

  it('should return false if the given value does not contains the . sign after the @', () => {
    const testValue = 'a@domaincom';
    expect(Helpers.isValidEmail(testValue)).toBe(false);
  });

  it('should return false if the given value does not contains any characters before the @', () => {
    const testValue = '@domain.com';
    expect(Helpers.isValidEmail(testValue)).toBe(false);
  });

  it('should return false if the given value does not contains any characters after the @', () => {
    const testValue = 'a@';
    expect(Helpers.isValidEmail(testValue)).toBe(false);
  });

  it('should return false if the given value does not contains any characters after the last period', () => {
    const testValue = 'a@domain.';
    expect(Helpers.isValidEmail(testValue)).toBe(false);
  });

  it('should return true if the given value contains a valid email', () => {
    const testValue = 'a@domain.com';
    expect(Helpers.isValidEmail(testValue)).toBe(true);
  });
});
