import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { UserModel } from '../models/users';
import UserService from '../models/users/UserService';
import { TOKEN_HEADER_KEY } from '../utils/constants';

export interface AuthRequest {
  user: UserModel
}

/**
 * Authentication/Authorization express provider middleware
 */
export default class AuthMiddleware {

  private userService: UserService = new UserService();

  public requireAuthorization = async (req: Request & AuthRequest, res: Response, next: NextFunction) => {
    // Extract token from header
    const token = req.header(TOKEN_HEADER_KEY);
    if (!token) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }
    // Token verification
    let tokenUserDetails = null;
    try {
      tokenUserDetails = jwt.verify(token, config.get('jwtPrivateKey'));
    } catch (e) {
      res.status(400).json({ error: 'Invalid token.' });
      return;
    }
    // Check in user in DB
    try {
      const user = await this.userService.findById(tokenUserDetails._id);
      if (!user) {
        res.status(400).json({ error: 'Given user does not exist' });
        return;
      }
      req.user = user;
      next();
    } catch (e) {
      res.status(400).json({ error: e.message });
      return;
    }
  };

  public requireAdminRole = (req: Request & AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user.role;
    if (role !== 'admin') {
      res.status(403).json({ error: 'Access denied. Given user is not an admin.' });
      return;
    }
    next();
  };

  public requireModeratorRole = (req: Request & AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user.role;
    // Admin can do all moderator actions
    if (role !== 'moderator' && role !== 'admin') {
      res.status(403).json({ error: 'Access denied. Given user is not an moderator.' });
      return;
    }
    next();
  };
}
