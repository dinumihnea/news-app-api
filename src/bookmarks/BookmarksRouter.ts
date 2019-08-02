import { Request, Response, Router } from 'express';
import BookmarkRepository from './BookmarkRepository';
import { CollectionRouter } from '../repositories/CollectionRouter';
import { Bookmark, BookmarkModel } from './Bookmark';
import { I18n } from '../repositories/I18n';
import NewsRepository from '../news/NewsRepository';
import { NewsModel } from '../news/News';

class BookmarksRouter implements CollectionRouter<BookmarkModel>, I18n<BookmarkModel> {

  public router: Router = Router();
  private repository: BookmarkRepository = new BookmarkRepository();
  private newsRepository: NewsRepository = new NewsRepository();

  constructor() {
    this.findAll = this.findAll.bind(this);
    this.create = this.create.bind(this);
    this.routes();
  }

  private routes(): void {
    this.router.get('/', this.findAll);
    this.router.post('/', this.create);
  }

  create(req: Request, res: Response): void {
    const bookmark = new Bookmark(req.body);

    if (this.isValid(bookmark)) {
      this.checkNews(bookmark.news._id)
        .then(news => {
          console.log('NEWS', news);
          this.repository.save(bookmark)
            .then((data: BookmarkModel) =>
              res.status(201).json({ data }))
            .catch(error =>
              res.status(500).json({ error: error.message }));
        })
        .catch((error: Error) => {
          console.error(error);
          res.status(500).json({ error: error.message });
        });

    } else {
      res.status(400).json({ error: 'Invalid bookmark.' });
    }
  }

  delete(req: Request, res: Response): void {
  }

  findAll(req: Request, res: Response): void {
    this.repository.findAll(0, 0)
      .then((data: Array<BookmarkModel>) => {
        let news = [];
        data.forEach(bookmark => news.push(bookmark.news));
        res.status(200).json(news);
      })
      .catch((error: Error) => {
        console.error('Error happened during the query.', error);
        res.status(500).json({ error: error.message });
      });
  }

  findOne(req: Request, res: Response): void {
  }

  isValid(model: BookmarkModel): boolean {
    return !!(model && model.user && model.news);
  }

  async checkNews(newsId: String): Promise<NewsModel> {
    return await this.newsRepository.findById(newsId);
  }

  translate(model: BookmarkModel, lang: String): any {
  }

  translateAll(models: Array<BookmarkModel>, lang: String): Array<any> {
    return undefined;
  }

  update(req: Request, res: Response): void {
  }

}

export default new BookmarksRouter().router;
