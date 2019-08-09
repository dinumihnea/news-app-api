import { UserRouter } from '../UserRouter';
import { User, UserModel } from '../User';

const userRouter: UserRouter = new UserRouter();

describe('isValid', () => {
  it('should return false when model is null', () => {
    expect(userRouter.isValid(null)).toBe(false);
  });

  it('should return false when model is an empty object', () => {
    expect(userRouter.isValid({} as UserModel)).toBe(false);
  });

  it('should return false when model does not contains username field', () => {
    const user = new User({ email: 'a@domain.com', password: '' });
    expect(userRouter.isValid(user)).toBe(false);
  });

  it('should return false when model does not contains email field', () => {
    const user = new User({ username: 'a', password: 'a' });
    expect(userRouter.isValid(user)).toBe(false);
  });

  it('should return false when model does not contains password field', () => {
    const user = new User({ username: 'a', email: 'a@doamain.com' });
    expect(userRouter.isValid(user)).toBe(false);
  });

  it('should return false when model contains an invalid email', () => {
    const user = new User({ username: 'a', email: 'a', password: 'a' });
    expect(userRouter.isValid(user)).toBe(false);
  });

  it('should return true when model contains valid username and valid email', () => {
    const user = new User({ username: 'a', email: 'a@domain.com', password: 'a' });
    expect(userRouter.isValid(user)).toBe(true);
  });
});
