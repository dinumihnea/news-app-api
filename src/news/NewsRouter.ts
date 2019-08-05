import { Request, Response, Router } from 'express';
import NewsRepository from './NewsRepository';
import { CollectionRouter } from '../router/CollectionRouter';
import { News, NewsModel } from './News';
import CategoryRepository from '../models/categories/CategoryRepository';
import { CategoryModel } from '../models/categories/Category';
import * as mongoose from 'mongoose';
import { TagModel } from '../tags/Tag';
import TagService from '../tags/TagService';

class NewsRouter implements CollectionRouter<NewsModel> {

  public static PAGE_SIZE = 48;
  public router: Router = Router();
  private categoryRepository: CategoryRepository = new CategoryRepository();
  private tagService: TagService = new TagService();
  private repository: NewsRepository = new NewsRepository();

  constructor() {
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findByCategory = this.findByCategory.bind(this);
    this.findOne = this.findOne.bind(this);
    this.findBySlug = this.findBySlug.bind(this);
    this.findByTagIn = this.findByTagIn.bind(this);
    this.routes();
  }

  private routes(): void {
    this.router.get('/', this.findAll);
    this.router.get('/categories/:category', this.findByCategory);
    this.router.get('/tags/:tag', this.findByTagIn);
    this.router.get('/:id', this.findOne);
    this.router.post('/', this.create);
    // this.router.get('/category/:category', this.repository.findByCategory);
    // this.router.get('/:id', this.repository.findOne);
    // this.router.put('/:id', this.repository.update);
    // this.router.delete('/:id', this.repository.delete);
  }

  create(req: Request, res: Response): void {
    if (this.isValid(req.body as NewsModel)) {

      this.createModel(req.body)
        .then(model => {

          this.repository.save(model)
            .then((data: NewsModel) =>
              res.status(201).json({ data }))
            .catch((error: Error) => {
              console.error('Error happened during save.', { error: error.message });
              res.status(500).json({ error: error.message });
            });

        })
        .catch((error: Error) => {
          console.error('Invalid model.', error);
          res.status(400).json({ error: error.message });
        });

    } else {
      res.status(400).json({ error: 'Invalid model.' });
    }
  }

  async findCategory(key: String): Promise<CategoryModel> {
    try {
      return await this.categoryRepository.findOne(key);
    } catch (error) {
      throw new Error(error);
    }
  }

  async createModel(requestBody: any): Promise<NewsModel> {
    const categoryKey = requestBody.category.key;
    const category = await this.findCategory(categoryKey);
    if (!category) {
      throw new Error('The category with given key was not found.');
    }
    return new News({
      category: { ...category },
      // TODO add slug generator logic
      slug: requestBody.slug,
      title: requestBody.title,
      author: requestBody.author,
      image: requestBody.image,
      body: requestBody.body,
      creationDate: requestBody.creationDate,
      tags: requestBody.tags
    });
  }

  findByCategory(req: Request, res: Response): void {
    const categoryKey = req.params.category;
    const offset = req.body.offset ? req.body.limit : 0;
    const limit = req.body.limit ? req.body.limit : NewsRouter.PAGE_SIZE;
    // const lang = req.headers['content-language'];
    if (!categoryKey) {
      res.status(400).json({ error: 'Request does not contains any category key' });
      return;
    }

    this.findCategory(categoryKey)
      .then(category => {

        if (!category) {
          res.status(400).json({ error: `Category with key: ${categoryKey} does not exists` });
          return;
        }

        this.repository.findByCategory(category.key, limit, offset)
          .then((data: Array<NewsModel>) => {
            res.status(200).json(data);
          })
          .catch((error: Error) => {
            console.error('Error happened during the query.', error);
            res.status(500).json({ error: error.message });
          });

      })
      .catch((error: Error) => {
        console.error('Error happened during the query.', error);
        res.status(500).json({ error: error.message });
      });
  }

  findByTagIn(req: Request, res: Response): void {
    const tagKey = req.params.tag;
    const offset = req.body.offset ? req.body.limit : 0;
    const limit = req.body.limit ? req.body.limit : NewsRouter.PAGE_SIZE;
    // const lang = req.headers['content-language'];

    this.findTag(tagKey)
      .then(tag => {

        if (!tag) {
          res.status(400).json({ error: `Category with key: ${tagKey} does not exists` });
          return;
        }

        this.repository.findByTag(tag.key, limit, offset)
          .then((data: Array<NewsModel>) => {
            res.status(200).json(data);
          })
          .catch((error: Error) => {
            console.error('Error happened during the query.', error);
            res.status(500).json({ error: error.message });
          });

      })
      .catch((error: Error) => {
        console.error('Error happened during the query.', error);
        res.status(500).json({ error: error.message });
      });
  }


  async findTag(key: String): Promise<TagModel> {
    try {
      return await this.tagService.findOne(key);
    } catch (error) {
      throw new Error(error);
    }
  }

  delete = async (req: Request, res: Response): Promise<void> => {
  };

  findAll(req: Request, res: Response): void {
    const offset = req.body.offset ? req.body.limit : 0;
    const limit = req.body.limit ? req.body.limit : NewsRouter.PAGE_SIZE;
    // const lang = req.headers['content-language'];

    this.repository.findAll(limit, offset)
      .then((data: Array<NewsModel>) => {
        res.status(200).json(data);
      })
      .catch((error: Error) => {
        console.error('Error happened during the query.', error);
        res.status(500).json({ error: error.message });
      });
  }

  findOne(req: Request, res: Response): void {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ error: 'Request does not contains any news identifier' });
      return;
    }
    // Check if the param is an ObjectId or a slug
    if (mongoose.Types.ObjectId.isValid(id)) {

      this.repository.findById(id)
        .then((data: NewsModel) => {
          res.status(200).json(data);
        })
        .catch((error: Error) => {
          console.error('Error happened during the query.', error);
          res.status(500).json({ error: error.message });
        });

    } else {

      this.repository.findOne(id)
        .then((data: NewsModel) => {
          res.status(200).json(data);
        })
        .catch((error: Error) => {
          console.error('Error happened during the query.', error);
          res.status(500).json({ error: error.message });
        });
    }
  }

  findBySlug(req: Request, res: Response): void {
    const slug = req.params.slug;
    if (slug) {
      this.repository.findOne(slug)
        .then((data: NewsModel) => {
          res.status(200).json(data);
        })
        .catch((error: Error) => {
          console.error('Error happened during the query.', error);
          res.status(500).json({ error: error.message });
        });
    } else {
      res.status(400).json({ error: 'Request does not contains any news identifier' });
    }
  }

  isValid(model: NewsModel): boolean {
    return !!(model && model.category && model.category.key && model.slug && model.title && model.author && model.body);
  }

  update(req: Request, res: Response): void {
  }

}

export default new NewsRouter().router;
