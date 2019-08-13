import { Category, CategoryModel } from './Category';
import CategoryRepository from './CategoryRepository';

export default class CategoryService implements CategoryRepository {

  constructor() {
    this.save = this.save.bind(this);
  }

  async save(category: CategoryModel): Promise<CategoryModel> {
    try {
      return await category.save();
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll(limit: number, offset: number): Promise<Array<CategoryModel>> {
    try {
      // Limit and offset are ignored
      // TODO Try another solution for models with few data
      return await Category.find();
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(key: String): Promise<CategoryModel> {
    try {
      return await Category.findOne({ key });
    } catch (e) {
      throw new Error(e);
    }
  }

  async findById(_id: String): Promise<CategoryModel> {
    try {
      return await Category.findById(_id);
    } catch (e) {
      throw new Error(e);
    }
  }

  async update(model: CategoryModel): Promise<any> {
    let category = await this.findOne(model.key);
    if (!category) {
      throw new Error('Category with given key does not exist');
    }
    try {
      return await category.updateOne({
        $set: {
          key: model.key,
          en: model.en,
          ro: model.ro,
          ru: model.ru,
        }
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async delete(key: String): Promise<any> {
    try {
      return await Category.deleteOne({ key: key });
    } catch (e) {
      throw new Error(e);
    }
  }

}
