import { Router } from 'express';
import { Repository } from '../repositories/Repository';
import { BookmarkModel } from './Bookmark';
import BookmarkRepository from './BookmarkRepository';

class BookmarksRouter {

  router: Router = Router();
  private repository: Repository<BookmarkModel> = new BookmarkRepository();

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

export default new BookmarksRouter().router;
