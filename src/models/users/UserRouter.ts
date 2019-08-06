import { Request, Response, Router } from 'express';
import { CollectionRouter } from '../../router/CollectionRouter';
import { User, UserModel } from './User';
import UserService from './UserService';
import ValidationProvider from '../../repositories/ValidationProvider';

class UserRouter implements CollectionRouter<UserModel>, ValidationProvider<UserModel> {

  public static PAGE_SIZE = 48;
  public router: Router = Router();
  private service: UserService = new UserService();

  constructor() {
    this.routes();
  }

  private routes(): void {
    this.router.get('/', this.findAll);
    this.router.get('/:id', this.findOne);
    this.router.post('/', this.create);
    this.router.delete('/:id', this.delete);
    this.router.put('/', this.update);
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const draftUser = new User(req.body);
    if (!this.isValid(draftUser)) {
      res.status(400).json({ error: 'Invalid User model' });
      return;
    }

    try {
      const user = await this.service.save(draftUser);
      res.status(201).json({ user });
    } catch (e) {
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
    const offset = req.body.offset ? req.body.limit : 0;
    const limit = req.body.limit ? req.body.limit : UserRouter.PAGE_SIZE;
    try {
      const users = await this.service.findAll(limit, offset);
      res.status(200).json(users);
    } catch (e) {
      console.error('Error happened during the query.', e);
      res.status(500).json({ error: e.message });
    }
  };

  findOne = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Invalid User id' });
      return;
    }

    try {
      const user = await this.service.findById(id);
      if (!user) {
        res.status(400).json({ error: 'User with given id does not exists.' });
        return;
      }
      res.status(200).json(user);
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
      const user = await this.service.update(draftUser);
      res.status(200).json(user);
    } catch (e) {
      console.error('Error happened during the update.', e);
      res.status(500).json({ error: e.message });
    }
  };

  isValid(model: UserModel): boolean {
    return !!(model && model.username && model.email);
  }

}

export default new UserRouter().router;
