import NewsRouter from '../NewsRouter';
import { News, NewsModel } from '../News';
import AuthMiddleware from '../../../auth/AuthMiddleware';

const tagRouter: NewsRouter = new NewsRouter(new AuthMiddleware());

describe('isValid', () => {
  it('should return false when model is null', () => {
    expect(tagRouter.isValid(null)).toBe(false);
  });

  it('should return false when model is an empty object', () => {
    expect(tagRouter.isValid({} as NewsModel)).toBe(false);
  });

  it('should return false when model does not contains category field', () => {
    const newsModel = new News({
      title: 'a',
      body: 'a'
    });
    expect(tagRouter.isValid(newsModel)).toBe(false);
  });

  it('should return false when model does not contains title field', () => {
    const newsModel = new News({
      category: { key: 'a' },
      body: 'a'
    });
    expect(tagRouter.isValid(newsModel)).toBe(false);
  });

  it('should return false when model does not contains body field', () => {
    const newsModel = new News({
      category: { key: 'a' },
      title: 'a',
      author: 'a',
    });
    expect(tagRouter.isValid(newsModel)).toBe(false);
  });

  it('should return true when model contains a valid news', () => {
    const newsModel = new News({
      category: { key: 'a' },
      title: 'a',
      body: 'a'
    });
    expect(tagRouter.isValid(newsModel)).toBe(true);
  });

});
