import { User } from '../models/users';
import { Request, Response, Router } from 'express';
import UserService from '../models/users/UserService';
import * as bcrypt from 'bcrypt';

export class AuthRouter {

  public router: Router = Router();
  private userService: UserService = new UserService();

  constructor() {
    this.routes();
  }

  authenticate = async (req: Request, res: Response): Promise<void> => {
    const draftUser = new User(req.body);
    try {
      await draftUser.validate();
    } catch (e) {
      res.status(400).json({ error: e.message });
      return;
    }
    try {
      // Check if user exists
      const user = await this.userService.findOneIncludePassword(draftUser.email);
      if (!user) {
        res.status(400).json({ error: 'Invalid email or password' });
        return;
      }
      // Check if password match crypt password from db
      const isValidPassword = await bcrypt.compare(draftUser.password, user.password as string);
      if (!isValidPassword) {
        res.status(400).json({ error: 'Invalid email or password' });
        return;
      }
      // Authentication succeed
      res.status(200).json(user.generateAuthToken());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };

  private routes(): void {
    this.router.post('/', this.authenticate);
  }

}

export default new AuthRouter().router;
