import { Request, Response, Router } from 'express';
import { CollectionRouter } from '../../router/CollectionRouter';
import { User, UserModel } from './User';
import UserService from './UserService';
import ValidationProvider from '../../repositories/ValidationProvider';
import Helpers from '../../utils/Helpers';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import AuthMiddleware, { AuthRequest } from '../../auth/AuthMiddleware';

export class UserRouter implements CollectionRouter<UserModel>, ValidationProvider<UserModel> {

  public static PAGE_SIZE = 48;
  public router: Router = Router();
  private service: UserService = new UserService();

  constructor() {
    this.routes();
  }

  findBookmarks = async (req: Request & AuthRequest, res: Response): Promise<void> => {
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : UserRouter.PAGE_SIZE;

    const id = req.user._id;
    if (!id) {
      res.status(400).json({ error: 'Invalid User id' });
      return;
    }

    try {
      const users = await this.service.findBookmarks(id, limit, offset);
      res.status(200).json(users);
    } catch (e) {
      console.error('Error happened during the query.', e);
      res.status(500).json({ error: e.message });
    }
  };

  private static async hashPassword(draftUser: UserModel): Promise<any> {
    const salt = await bcrypt.genSalt(10);
    draftUser.password = await bcrypt.hash(draftUser.password, salt);
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const draftUser = new User(req.body);
    try {
      await draftUser.validate();
    } catch (e) {
      res.status(400).json({ error: e.message });
      return;
    }
    try {
      await UserRouter.hashPassword(draftUser);
      const user = await this.service.save(draftUser);
      res.status(201).header('x-auth-token', user.generateAuthToken()).json(user.getPublicFields());
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };

  /**
   * Provides all information about the user
   */
  findCurrentUser = async (req: Request & AuthRequest, res: Response): Promise<void> => {
    const id = req.user._id;
    if (!id) {
      res.status(400).json({ error: 'Invalid User id' });
      return;
    }

    try {
      // Find by id
      const user = await this.service.findById(id);
      if (!user) {
        res.status(400).json({ error: 'User with given identifier does not exist.' });
        return;
      }
      res.status(200).json(_.pick(user, ['_id', 'email', 'firstName', 'lastName', 'createdAt']));
    } catch (e) {
      console.error('Error happened during the query.', e);
      res.status(500).json({ error: e.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const _id = req.params.id;
    if (!_id) {
      res.status(400).json({ error: 'Invalid User id' });
      return;
    }

    try {
      const data = await this.service.delete(_id);
      // Responds with an “No Content” status
      res.status(data.deletedCount !== 0 ? 204 : 304).json();
    } catch (e) {
      console.error('Error happened during the query', e);
      res.status(500).json({ error: e.message });
    }
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : UserRouter.PAGE_SIZE;

    try {
      const users = await this.service.findAll(limit, offset);
      res.status(200).json(users);
    } catch (e) {
      console.error('Error happened during the query.', e);
      res.status(500).json({ error: e.message });
    }
  };
  /**
   * Provides only the public information about the user
   */
  findOne = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Invalid User id' });
      return;
    }

    try {
      let user = null;
      // Check if the given param is an ObjectId or a key
      if (mongoose.Types.ObjectId.isValid(id)) {
        // Find by id
        user = await this.service.findById(id);
      } else {
        // Find by email
        user = await this.service.findOne(id);
      }
      if (!user) {
        res.status(400).json({ error: 'User with given identifier does not exist.' });
        return;
      }
      res.status(200).json(user.getPublicFields());
    } catch (e) {
      console.error('Error happened during the query.', e);
      res.status(500).json({ error: e.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const draftUser = req.body;
    if (!this.isValid(draftUser)) {
      res.status(400).json('Invalid User model.');
      return;
    }

    try {
      const data = await this.service.update(draftUser);
      // Responds with an “No Content” status
      res.status(data.nModified !== 0 ? 204 : 304).json();
    } catch (e) {
      console.error('Error happened during the update.', e);
      res.status(500).json({ error: e.message });
    }
  };

  isValid(model: UserModel): boolean {
    return !!(model && Helpers.isValidEmail(model.email) && model.password);
  }

  private routes(): void {
    this.router.get('/me', AuthMiddleware.requireAuthentication, this.findCurrentUser);
    this.router.get('/me/bookmarks', AuthMiddleware.requireAuthentication, this.findBookmarks);

    this.router.get('/', AuthMiddleware.requireAuthentication, this.findAll);
    this.router.get('/:id', AuthMiddleware.requireAuthentication, this.findOne);
    this.router.post('/', this.create);
    this.router.delete('/:id', [AuthMiddleware.requireAuthentication, AuthMiddleware.requireAdminRole], this.delete);
    this.router.put('/', AuthMiddleware.requireAuthentication, this.update);
  }

}

export default new UserRouter().router;
