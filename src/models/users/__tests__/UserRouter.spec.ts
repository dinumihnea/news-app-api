import UserRouter from '../UserRouter';
import { User, UserModel } from '../User';
import AuthMiddleware from '../../../auth/AuthMiddleware';

const userRouter: UserRouter = new UserRouter(new AuthMiddleware());

describe('isValid', () => {
  it('should return false when model is null', () => {
    expect(userRouter.isValid(null)).toBe(false);
  });

  it('should return false when model is an empty object', () => {
    expect(userRouter.isValid({} as UserModel)).toBe(false);
  });

  it('should return false when model does not contains email field', () => {
    const user = new User({ password: '12345678' });
    expect(userRouter.isValid(user)).toBe(false);
  });

  it('should return false when model does not contains password field', () => {
    const user = new User({ email: 'a@doamain.com' });
    expect(userRouter.isValid(user)).toBe(false);
  });

  it('should return false when model contains an invalid email', () => {
    const user = new User({ email: 'a', password: 'a' });
    expect(userRouter.isValid(user)).toBe(false);
  });

  it('should return true when model is valid', () => {
    const user = new User({ email: 'a@domain.com', password: '12345678' });
    expect(userRouter.isValid(user)).toBe(true);
  });
});
