import TagRouter from '../TagRouter';
import { Tag, TagModel } from '../Tag';
import AuthMiddleware from '../../../auth/AuthMiddleware';

const tagRouter: TagRouter = new TagRouter(new AuthMiddleware());

describe('isValid', () => {
  it('should return false when model is null', () => {
    expect(tagRouter.isValid(null)).toBe(false);
  });

  it('should return false when model is an empty object', () => {
    expect(tagRouter.isValid({} as TagModel)).toBe(false);
  });

  it('should return false when model does not contains key field', () => {
    const tag = new Tag();
    expect(tagRouter.isValid(tag)).toBe(false);
  });

  it('should return false when model contains empty key', () => {
    const tag = new Tag({ key: '' });
    expect(tagRouter.isValid(tag)).toBe(false);
  });

  it('should return true when model contains a valid key', () => {
    const tag = new Tag({ key: 'a' });
    expect(tagRouter.isValid(tag)).toBe(true);
  });
});
