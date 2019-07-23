import { Router } from 'express';
import NewsRepository from './NewsRepository';
import { Repository } from '../repositories/Repository';
import { NewsModel } from './News';

class NewsRouter {

  router: Router = Router();
  private repository: Repository<NewsModel> = new NewsRepository();

  constructor() {
    this.routes();
  }

  private routes(): void {
    this.router.get('/', this.repository.findAll);
    this.router.get('/:id', this.repository.findOne);
    this.router.post('/', this.repository.create);
    this.router.put('/:id', this.repository.update);
    this.router.delete('/:id', this.repository.delete);
  }

}

export default new NewsRouter().router;
