import { Repository } from '../repositories/Repository';
import { Request, Response } from 'express';
import { News, NewsModel } from './News';

export default class NewsRepository implements Repository<NewsModel> {

  constructor() {
    this.create = this.create.bind(this);
  }

  create(req: Request, res: Response): void {
    const news = new News(req.body);
    console.log(news);

    if (this.isValid(news)) {
      news.save()
        .then((data: NewsModel) =>
          res.status(201).json({data}))
        .catch((error: Error) => {
          console.error('Error happened during save.', error);
          res.status(500).json({error});
        });
    } else {
      res.status(400).json({error: 'Invalid news.'});
    }
  }

  findAll(req: Request, res: Response): void {
    // TODO implement limit/offset logic
    News.find({})
      .then((data: Array<NewsModel>) => res.status(200).json(data))
      .catch((error: Error) => {
        console.error('Error happened during find.', error);
        res.status(500).json(error);
      });
  }

  findOne(req: Request, res: Response): void {
  }

  delete(req: Request, res: Response): void {
  }

  update(req: Request, res: Response): void {
  }

  isValid(model: NewsModel): boolean {
    return !!(model && model.title && model.author && model.body);
  }
}
