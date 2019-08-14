import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { UserRoleType } from '../models/users';

export interface AuthRequest {
  user: {
    _id: string;
    role: UserRoleType
  }
}

/**
 * Authentication/Authorization express provider middleware
 */
export default class AuthMiddleware {
  // TODO implement DB user checking to avoid cases when user is updated or deleted

  public requireAuthorization(req: Request & AuthRequest, res: Response, next: NextFunction) {
    const token = req.header('x-auth-token');
    if (!token) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    try {
      req.user = jwt.verify(token, config.get('jwtPrivateKey'));
      next();
    } catch (e) {
      res.status(400).json({ error: 'Invalid token.' });
      return;
    }
  }

  public requireAdminRole(req: Request & AuthRequest, res: Response, next: NextFunction) {
    const role = req.user.role;
    if (role !== 'admin') {
      res.status(403).json({ error: 'Access denied. Given user is not an admin.' });
      return;
    }
    next();
  }

  public requireModeratorRole(req: Request & AuthRequest, res: Response, next: NextFunction) {
    const role = req.user.role;
    // Admin can do all moderator actions
    if (role !== 'moderator' && role !== 'admin') {
      res.status(403).json({ error: 'Access denied. Given user is not an moderator.' });
      return;
    }
    next();
  }
}
