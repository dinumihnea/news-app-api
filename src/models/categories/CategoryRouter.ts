import { Request, Response, Router } from 'express';
import { Category, CategoryModel } from './Category';
import I18nUtils from '../../i18n/Utils';
import { CollectionRouter } from '../../router/CollectionRouter';
import { I18n, Language } from '../../i18n/I18n';
import CategoryService from './CategoryService';
import ValidationProvider from '../../repositories/ValidationProvider';
import AuthMiddleware from '../../auth/AuthMiddleware';

export default class CategoryRouter implements CollectionRouter<CategoryModel>, I18n<CategoryModel>, ValidationProvider<CategoryModel> {

  public router: Router = Router();
  private service: CategoryService = new CategoryService();
  private auth: AuthMiddleware;

  constructor(auth: AuthMiddleware) {
    this.auth = auth;
    this.routes();
  }

  private routes(): void {
    this.router.get('/', this.findAll);
    this.router.get('/:key', this.findOne);
    this.router.post('/', [this.auth.requireAuthorization, this.auth.requireAdminRole], this.create);
    this.router.put('/', [this.auth.requireAuthorization, this.auth.requireAdminRole], this.update);
    this.router.delete('/:key', [this.auth.requireAuthorization, this.auth.requireAdminRole], this.delete);
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const draftCategory = new Category(req.body);
    if (!this.isValid(draftCategory)) {
      res.status(400).json({ error: 'Invalid Category model.' });
      return;
    }
    try {
      const category = await this.service.save(draftCategory);
      res.status(202).json({ category });
    } catch (e) {
      console.error('Error happened during the save.', e);
      res.status(500).json({ error: e.message });
    }
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    const lang = req.headers['content-language'] as Language;
    try {
      const categories = await this.service.findAll(0, 0);
      res.status(200).json(this.translateAll(categories, lang));
    } catch (e) {
      console.error('Error happened during the query.', e);
      res.status(500).json({ error: e.message });
    }
  };

  findOne = async (req: Request, res: Response): Promise<void> => {
    const lang = req.headers['content-language'] as Language;
    const key = req.params.key;
    if (!key) {
      res.status(400).json({ error: 'Invalid category key' });
      return;
    }
    try {
      const category = await this.service.findOne(key);
      res.status(200).json(this.translate(category, lang));
    } catch (e) {
      console.error('Error happened during the query', e);
      res.status(500).json({ error: e.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const draftCategory = req.body;
    if (!this.isValid(draftCategory as CategoryModel)) {
      res.status(400).json({ error: 'Invalid category model' });
      return;
    }
    try {
      const data = await this.service.update(draftCategory);
      // Responds with an “No Content” status
      res.status(data.nModified !== 0 ? 204 : 304).json();
    } catch (e) {
      console.error('Error happened during the query', e);
      res.status(500).json({ error: e.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const key = req.params.key;
    try {
      const data = await this.service.delete(key);
      // Responds with an “No Content” status
      res.status(data.deletedCount !== 0 ? 204 : 304).json();
    } catch (e) {
      console.error('Error happened during the query', e);
      res.status(500).json({ error: e.message });
    }
  };

  isValid(model: CategoryModel): boolean {
    return !!(model && model.key && model.en && model.ru && model.ro);
  }

  translate(category: CategoryModel, lang: Language) {
    return {
      _id: category._id,
      key: category.key,
      title: I18nUtils.translate(lang, category.en, category.ro, category.ru, category.en)
    };
  }

  translateAll(categories: Array<CategoryModel>, lang: Language) {
    let translatedCategories = [];
    for (let category of categories) {
      translatedCategories.push(this.translate(category, lang));
    }
    return translatedCategories;
  }
}
