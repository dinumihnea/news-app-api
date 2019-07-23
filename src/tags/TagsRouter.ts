import { Router } from 'express';
import { TagModel } from './Tag';
import TagRepository from './TagRepository';
import { Repository } from '../repositories/Repository';

class TagsRouter {

  router: Router = Router();
  private repository: Repository<TagModel> = new TagRepository;

  constructor() {
    this.routes();
  }

  private routes(): void {
    this.router.get('/', this.repository.findAll);
    this.router.get('/:name', this.repository.findOne);
    this.router.post('/', this.repository.create);
    this.router.put('/:name', this.repository.update);
    this.router.delete('/:name', this.repository.delete);
  }

}

export default new TagsRouter().router;
