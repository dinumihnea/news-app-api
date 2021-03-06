import { Request, Response, Router } from 'express';
import { CollectionRouter } from '../../router/CollectionRouter';
import { News, NewsModel } from './News';
import NewsService from './NewsService';
import ValidationProvider from '../../repositories/ValidationProvider';
import AuthMiddleware, { AuthRequest } from '../../auth/AuthMiddleware';

export default class NewsRouter implements CollectionRouter<NewsModel>, ValidationProvider<NewsModel> {

  public static PAGE_SIZE = 48;
  public router: Router = Router();
  private service: NewsService = new NewsService();
  private auth: AuthMiddleware;

  constructor(auth: AuthMiddleware) {
    this.auth = auth;
    this.routes();
  }

  private routes(): void {
    this.router.get('/', this.findAll);
    this.router.get('/search', this.search);
    this.router.get('/categories/:category', this.findByCategory);
    this.router.get('/tags/:tag', this.findByTagIn);
    this.router.get('/:id', this.findOne);
    this.router.post('/', [this.auth.requireAuthorization, this.auth.requireModeratorRole], this.create);
    this.router.put('/', [this.auth.requireAuthorization, this.auth.requireModeratorRole], this.update);
    this.router.delete('/:id', [this.auth.requireAuthorization, this.auth.requireModeratorRole], this.delete);
  }

  create = async (req: Request & AuthRequest, res: Response): Promise<void> => {
    const user = req.user;
    if (!user) {
      res.status(400).json({ error: 'Request does not contains user info.' });
      return;
    }
    const draftNews = req.body;
    if (!this.isValid(draftNews as NewsModel)) {
      res.status(400).json({ error: 'Invalid News model.' });
      return;
    }

    try {
      let news = new News(draftNews);
      news.author = user.getDisplayName();
      const savedNews = await this.service.save(news);
      res.status(201).json({ savedNews });
    } catch (e) {
      console.error('Error happened during the save.', e);
      res.status(500).json({ error: e.message });
    }
  };

  findByCategory = async (req: Request, res: Response): Promise<void> => {
    const categoryKey = req.params.category;
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : NewsRouter.PAGE_SIZE;
    // const lang = req.headers['content-language'];
    if (!categoryKey) {
      res.status(400).json({ error: 'Request does not contains any category key' });
      return;
    }

    try {
      const news = await this.service.findByCategory(categoryKey, limit, offset);
      res.status(200).json(news);
    } catch (e) {
      console.error('Error happened during the query.', e);
      res.status(500).json({ error: e.message });
    }
  };

  findByTagIn = async (req: Request, res: Response): Promise<void> => {
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : NewsRouter.PAGE_SIZE;
    const tagKey = req.params.tag;
    // const lang = req.headers['content-language'];
    if (!tagKey) {
      res.status(500).json({ error: 'Request does not contains any category key.' });
      return;
    }

    try {
      const news = await this.service.findByTag(tagKey, limit, offset);
      res.status(200).json(news);
    } catch (e) {
      console.error('Error happened during the query.', e);
      res.status(500).json({ error: e.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Request does not contains any identifier.' });
    }

    try {
      const data = await this.service.delete(id);
      // Responds with an “No Content” status
      res.status(data.deletedCount !== 0 ? 204 : 304).json();
    } catch (e) {
      console.error('Error happened during the update.', e);
      res.status(500).json({ error: e.message });
    }
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : NewsRouter.PAGE_SIZE;
    // const lang = req.headers['content-language'];

    try {
      const news = await this.service.findAll(limit, offset);
      res.status(200).json(news);
    } catch (e) {
      console.error('Error happened during the query.', e);
      res.status(500).json({ error: e.message });
    }
  };

  search = async (req: Request, res: Response): Promise<void> => {
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : NewsRouter.PAGE_SIZE;
    // const lang = req.headers['content-language'];
    const query = req.query.q;
    if (!query) {
      res.status(400).json({ error: 'Request does not contains any search word.' });
    }

    try {
      const news = await this.service.search(query, limit, offset);
      res.status(200).json(news);
    } catch (e) {
      console.error('Error happened during the query.', e);
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
      const news = await this.service.findOne(id);
      if (!news) {
        res.status(400).json({ error: 'News with given id does not exist' });
        return;
      }
      res.status(200).json(news);
    } catch (e) {
      console.error('Error happened during the query.', e);
      res.status(500).json({ error: e.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const draftNews = req.body;
    if (!this.isValid(draftNews as NewsModel)) {
      res.status(400).json({ error: 'Invalid News model.' });
    }

    try {
      const news = await this.service.update(new News(req.body));
      res.status(200).json(news);
    } catch (e) {
      console.error('Error happened during the update.', e);
      res.status(500).json({ error: e.message });
    }
  };

  isValid(model: NewsModel): boolean {
    return !!(model && model.category && model.category.key && model.title && model.body);
  }

}
