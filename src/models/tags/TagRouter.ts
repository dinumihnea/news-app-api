import { Request, Response, Router } from 'express';
import { Tag, TagModel } from './Tag';
import { CollectionRouter } from '../../router/CollectionRouter';
import * as mongoose from 'mongoose';
import TagService from './TagService';
import ValidationProvider from '../../repositories/ValidationProvider';
import AuthMiddleware from '../../auth/AuthMiddleware';

class TagRouter implements CollectionRouter<TagModel>, ValidationProvider<TagModel> {

  public static PAGE_SIZE = 12;
  public router: Router = Router();
  private service: TagService = new TagService;
  private auth: AuthMiddleware;

  constructor(auth: AuthMiddleware) {
    this.auth = auth;
    this.routes();
  }

  update = async (req: Request, res: Response): Promise<void> => {
    res.status(403).json({ error: 'The tag can not be updated as entity, use delete and create instead' });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const key: string = req.body.key;
    const draftTag = new Tag({ key });
    if (!this.isValid(draftTag as TagModel)) {
      res.status(400).json({ error: 'Invalid tag name.' });
      return;
    }

    try {
      const tag = await this.service.save(draftTag);
      res.status(201).json({ tag });
    } catch (e) {
      console.error('Error happened during save.', e.message);
      res.status(500).json({ error: e.message });
    }
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : TagRouter.PAGE_SIZE;

    try {
      const tags = await this.service.findAll(limit, offset);
      res.status(200).json(tags);
    } catch (e) {
      console.error('Error happened during the find.', e.message);
      res.status(500).json({ error: e.message });
    }
  };

  findOne = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Request does not contains any news identifier' });
      return;
    }
    try {
      // Check if the given param is an ObjectId or a key
      if (mongoose.Types.ObjectId.isValid(id)) {
        // Find by id
        const tag = await this.service.findById(id);
        res.status(200).json(tag);
      } else {
        // Find by tag key
        const tag = await this.service.findOne(id);
        res.status(200).json(tag);
      }
    } catch (e) {
      console.error('Error happened during the find.', e.message);
      res.status(500).json({ error: e.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const key = req.params.key;
    if (!key) {
      res.status(400).json({ error: 'The given request does not contains any tag key' });
      return;
    }

    try {
      // Check if the given param is an ObjectId or a key
      if (mongoose.Types.ObjectId.isValid(key)) {
        // Delete by id
        const data = await this.service.deleteById(key);
        // Responds with an “No Content” status
        res.status(data.deletedCount !== 0 ? 204 : 304).json();
      } else {
        // Delete by tag key
        const data = await this.service.delete(key);
        // Responds with an “No Content” status
        res.status(data.deletedCount !== 0 ? 204 : 304).json();
      }
    } catch (e) {
      console.error('Error happened during the delete.', e.message);
      res.status(500).json({ error: e.message });
    }
  };

  private routes(): void {
    this.router.get('/', this.findAll);
    this.router.post('/', [this.auth.requireAuthorization, this.auth.requireModeratorRole], this.create);
    this.router.get('/:id', this.findOne);
    this.router.delete('/:key', [this.auth.requireAuthorization, this.auth.requireModeratorRole], this.delete);
    this.router.put('/', this.update);
  }

  isValid(model: TagModel): boolean {
    return !!(model && model.key);
  }

}

export default TagRouter;
