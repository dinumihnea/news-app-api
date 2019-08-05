import { Request, Response, Router } from 'express';
import { Tag, TagModel } from './Tag';
import { CollectionRouter } from '../router/CollectionRouter';
import * as mongoose from 'mongoose';
import TagService from './TagService';

class TagsRouter implements CollectionRouter<TagModel> {

  public static PAGE_SIZE = 12;
  public router: Router = Router();
  private service: TagService = new TagService;

  constructor() {
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.routes();
  }

  private routes(): void {
    this.router.get('/', this.findAll);
    this.router.post('/', this.create);
    this.router.get('/:id', this.findOne);
    // this.router.post('/', this.service.create);
    // this.router.put('/:name', this.service.update);
    // this.router.delete('/:name', this.service.delete);
  }

  create(req: Request, res: Response): void {
    const key: string = req.body.key;
    const tag = new Tag({ key });
    if (this.isValid(tag as TagModel)) {

      this.service.save(tag)
        .then((data: TagModel) =>
          res.status(201).json({ data }))
        .catch((error: Error) => {
          console.error('Error happened during save.', error.message);
          res.status(500).json({ error: error.message });
        });

    } else {
      res.status(400).json({ error: 'Invalid tag name.' });
    }
  }

  findAll(req: Request, res: Response): void {
    const offset = req.body.offset ? req.body.limit : 0;
    const limit = req.body.limit ? req.body.limit : TagsRouter.PAGE_SIZE;
    this.service.findAll(limit, offset)
      .then((data: Array<TagModel>) =>
        res.status(200).json(data))
      .catch((error: Error) => {
        console.error('Error happened during the find.', error.message);
        res.status(500).json({ error: error.message });
      });
  }

  findOne(req: Request, res: Response): void {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Request does not contains any news identifier' });
      return;
    }
    // Check if the param is an ObjectId or a key
    if (mongoose.Types.ObjectId.isValid(id)) {

      this.service.findById(id)
        .then((data: TagModel) =>
          res.status(200).json(data))
        .catch((error: Error) => {
          console.error('Error happened during the find.', error.message);
          res.status(500).json({ error: error.message });
        });

    } else {

      this.service.findOne(id)
        .then((data: TagModel) =>
          res.status(200).json(data))
        .catch((error: Error) => {
          console.error('Error happened during the find.', error.message);
          res.status(500).json({ error: error.message });
        });
    }
  }

  delete(req: Request, res: Response): void {
  }

  isValid(model: TagModel): boolean {
    return !!(model && model.key);
  }

  update(req: Request, res: Response): void {
  }

}

export default new TagsRouter().router;
