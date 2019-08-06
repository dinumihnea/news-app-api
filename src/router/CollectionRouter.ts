import { Request, Response } from 'express';

/**
 * Abstract representation of routes bound with database models
 */
export interface CollectionRouter<Model> {
  /**
   * Create a copy of specific model and save it into DB
   * @param req given Request which wrap appropriate data in the body
   * @param res returned Response
   */
  create: (req: Request, res: Response) => Promise<void>

  /**
   * Gets all records from collection
   * @param req given Request which wrap appropriate data into body field
   * @param res returned Response
   */
  findAll: (req: Request, res: Response) => Promise<void>

  /**
   * Gets a copy of specific object based on given identifier
   * @param req given Request with an identifier in the body
   * @param res returned Response
   */
  findOne: (req: Request, res: Response) => Promise<void>

  /**
   * Updates a record in DB based on given identifier
   * @param req given Request with an identifier in the body
   * @param res returned Response
   */
  update: (req: Request, res: Response) => Promise<void>

  /**
   * Delete a record of specific model from DB
   * @param req given Request which wrap an identifier in the body
   * @param res returned Response
   */
  delete: (req: Request, res: Response) => Promise<void>

}
