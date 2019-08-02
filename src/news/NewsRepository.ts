import { News, NewsModel } from './News';
import { StoredCollection } from '../repositories/StoredCollection';

export default class NewsRepository implements StoredCollection<NewsModel> {

  constructor() {
    this.save = this.save.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  async save(news: NewsModel): Promise<NewsModel> {
    try {
      return await news.save();
    } catch (e) {
      throw new Error(e);
    }
  }


  // findAll(req: Request, res: Response): void {
  //   // TODO implement limit/offset logic
  //   News.find({})
  //     .then((data: Array<NewsModel>) => res.status(200).json(data))
  //     .catch((error: Error) => {
  //       console.error('Error happened during find.', error);
  //       res.status(500).json(error);
  //     });
  // }

  isValid(model: NewsModel): boolean {
    return !!(model && model.title && model.author && model.body);
  }

  // findByTag(req: Request, res: Response): void {
  //   const tag = req.params.tag;
  //   if (tag) {
  //     News.find({ tags: { $in: tag } })
  //       .sort({ creationDate: -1 })
  //       .then((data: Array<NewsModel>) => res.status(200).json(data))
  //       .catch((error: Error) => {
  //         console.error('Error happened during find.', error);
  //         res.status(500).json(error);
  //       });
  //   } else {
  //     res.status(500).json('Invalid body.');
  //   }
  // }

  // findByCategory(req: Request, res: Response): void {
  //   const category = req.params.category;
  //   const lang = req.params.headers['content-language'];
  //   if (category) {
  //     // TODO filter by category
  //     News.find({
  //       category: category
  //     }).sort({ creationDate: -1 })
  //       .then((data: Array<NewsModel>) => {
  //         const arr = [];
  //         for (let item of data) {
  //           arr.push(this.translate(item, lang));
  //         }
  //         res.status(200).json(arr);
  //       })
  //       .catch((error: Error) => {
  //         console.error('Error happened during find.', error);
  //         res.status(500).json(error);
  //       });
  //   } else {
  //     res.status(500).json('Invalid body.');
  //   }
  // }

  delete(key: String): Promise<any> {
    return undefined;
  }

  async findAll(limit: number, offset: number): Promise<Array<NewsModel>> {
    try {
      return await News.find()
        .sort({ creationDate: -1 })
        .skip(offset)
        .select('-body')
        .limit(limit);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findByCategory(categoryKey: String, limit: number, offset: number): Promise<Array<NewsModel>> {
    try {
      return await News.find({ 'category.key': categoryKey })
        .sort({ creationDate: -1 })
        .skip(offset)
        .select('-body')
        .limit(limit);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findByTag(tag: String, limit: number, offset: number): Promise<Array<NewsModel>> {
    try {
      return await News.find({ 'tags': { $in: tag } })
        .sort({ creationDate: -1 })
        .skip(offset)
        .select('-body')
        .limit(limit);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findById(_id: String): Promise<NewsModel> {
    try {
      return await News.findById(_id);
    } catch (e) {
      throw new Error(e);
    }
  }

  async findOne(slug: String): Promise<NewsModel> {
    try {
      return await News.findOne({ slug });
    } catch (e) {
      throw new Error(e);
    }
  }

  update(model: NewsModel): Promise<any> {
    return undefined;
  }

}
