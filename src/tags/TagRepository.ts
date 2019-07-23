import { Repository } from '../repositories/Repository';
import { Tag, TagModel } from './Tag';
import { Request, Response } from 'express';

export default class TagRepository implements Repository<TagModel> {

  constructor() {
    this.create = this.create.bind(this)
  }

  create(req: Request, res: Response): void {
    const name: string = req.body.name;
    const tag = new Tag({name});

    if (this.isValid(tag)) {
      tag.save()
        .then((data: TagModel) =>
          res.status(201).json({data}))
        .catch((error: Error) => {
          console.error('Error happened during save.', error);
          res.status(500).json({error});
        });
    } else {
      res.status(400).json({error: 'Invalid tag name.'});
    }
  }

  findAll(req: Request, res: Response): void {
    // TODO implement limit/offset logic
    Tag.find({})
      .then((data: Array<TagModel>) => res.status(200).json(data))
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

  isValid(model: TagModel): boolean {
    return !!(model && model.name);
  }
}
