import { Request, Response, Router } from 'express';
import CategoryRepository from './CategoryRepository';
import { Category, CategoryModel } from './Category';
import I18nUtils from '../i18n/Utils';
import { CollectionRouter } from '../repositories/CollectionRouter';
import { I18n } from '../repositories/I18n';

class CategoryRouter implements CollectionRouter<CategoryModel>, I18n<CategoryModel> {

  public router: Router = Router();
  private repository: CategoryRepository = new CategoryRepository();

  constructor() {
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.routes();
  }

  private routes(): void {
    this.router.get('/', this.findAll);
    this.router.get('/:key', this.findOne);
    this.router.post('/', this.create);
    this.router.put('/', this.update);
    this.router.delete('/:key', this.delete);
  }

  create(req: Request, res: Response): void {
    const category = new Category(req.body);

    if (this.isValid(category)) {

      this.repository.save(category)
        .then((data: CategoryModel) =>
          res.status(202).json({ data }))
        .catch((error: Error) => {
          console.error('Error happened during the save.', error);
          res.status(500).json({ error: error.message });
        });

    } else {
      res.status(400).json({ error: 'Invalid model.' });
    }
  }

  findAll(req: Request, res: Response): void {
    const lang = req.headers['content-language'];
    this.repository.findAll(0, 0)
      .then((data: Array<CategoryModel>) => {
        res.status(200).json(this.translateAll(data, lang));
      })
      .catch((error: Error) => {
        console.error('Error happened during the query.', error);
        res.status(500).json({ error: error.message });
      });
  }

  findOne(req: Request, res: Response): void {
    const lang = req.headers['content-language'];
    const key = req.params.key;
    this.repository.findOne(key)
      .then((data: CategoryModel) => {
        res.status(200).json(this.translate(data, lang));
      })
      .catch((error: Error) => {
        console.error('Error happened during the query', error);
        res.status(500).json({ error: error.message });
      });
  }

  update(req: Request, res: Response): void {
    const category = new Category(req.body);
    this.repository.update(category)
      .then((data: any) => {
        // Responds with an “No Content” status
        res.status(data.nModified !== 0 ? 204 : 304).json();
      })
      .catch((error: Error) => {
        console.error('Error happened during the query', error);
        res.status(500).json({ error: error.message });
      });
  }

  delete(req: Request, res: Response): void {
    const key = req.params.key;
    this.repository.delete(key)
      .then((data: any) => {
        // Responds with an “No Content” status
        res.status(data.deletedCount !== 0 ? 204 : 304).json();
      })
      .catch((error: Error) => {
        console.error('Error happened during the query', error);
        res.status(500).json({ error: error.message });
      });
  }

  isValid(model: CategoryModel): boolean {
    return !!(model && model.key && model.en && model.ru && model.ro);
  }

  translate(category: CategoryModel, lang) {
    return {
      _id: category._id,
      key: category.key,
      title: I18nUtils.translate(lang, category.en, category.ro, category.ru, category.en)
    };
  }

  translateAll(categories: Array<CategoryModel>, lang) {
    let translatedCategories = [];
    for (let category of categories) {
      translatedCategories.push(this.translate(category, lang));
    }
    return translatedCategories;
  }
}

export default new CategoryRouter().router;
