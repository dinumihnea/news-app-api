import { Request, Response } from 'express';
import { Repository } from '../repositories/Repository';
import { Bookmark, BookmarkModel } from './Bookmark';

export default class BookmarkRepository implements Repository<BookmarkModel> {

  constructor() {
    this.create = this.create.bind(this);
  }

  create(req: Request, res: Response): void {
    const bookmark = new Bookmark(req.body);

    if (this.isValid(bookmark)) {
      bookmark.save()
        .then((data: BookmarkModel) =>
          res.status(201).json({ data }))
        .catch(error => res.status(500).json({ error }));
    } else {
      res.status(400).json({ error: 'Invalid bookmark.' });
    }
  }

  delete(req: Request, res: Response): void {
  }

  findAll(req: Request, res: Response): void {
    // TODO implement limit/offset logic
    Bookmark.find({})
      .sort({ creationDate: -1 })
      .then((data: Array<BookmarkModel>) => res.status(200).json(data))
      .catch((error: Error) => {
        console.error('Error happened during find.', error);
        res.status(500).json(error);
      });
  }

  findOne(req: Request, res: Response): void {
  }

  isValid(model: BookmarkModel): boolean {
    return !!(model && model.newsId && model.userId);
  }

  update(req: Request, res: Response): void {
  }
}
