import CategoryRouter from '../CategoryRouter';
import { Category, CategoryModel } from '../Category';
import AuthMiddleware from '../../../auth/AuthMiddleware';

const categoryRouter: CategoryRouter = new CategoryRouter(new AuthMiddleware());

describe('isValid', () => {
  it('should return false when given model is null', () => {
    expect(categoryRouter.isValid(null)).toBe(false);
  });

  it('should return false when model is empty', () => {
    const category = {};
    expect(categoryRouter.isValid(category as CategoryModel)).toBe(false);
  });

  it('should return false when model does not contains key', () => {
    const category = new Category({ key: '', en: 'a', ro: 'a', ru: 'a' });
    expect(categoryRouter.isValid(category as CategoryModel)).toBe(false);
  });

  it('should return false when model does not contains en value', () => {
    const category: CategoryModel = new Category({ key: 'a', en: '', ro: 'a', ru: 'a' });
    expect(categoryRouter.isValid(category)).toBe(false);
  });

  it('should return false when model does not contains ro value', () => {
    const category: CategoryModel = new Category({ key: 'a', en: 'a', ro: '', ru: 'a' });
    expect(categoryRouter.isValid(category)).toBe(false);
  });

  it('should return false when model does not contains ru value', () => {
    const category: CategoryModel = new Category({ key: 'a', en: 'a', ro: 'a', ru: '' });
    expect(categoryRouter.isValid(category)).toBe(false);
  });

  it('should return true when model contains all required values', () => {
    const category: CategoryModel = new Category({ key: 'a', en: 'a', ro: 'a', ru: 'a' });
    expect(categoryRouter.isValid(category)).toBe(true);
  });
});
