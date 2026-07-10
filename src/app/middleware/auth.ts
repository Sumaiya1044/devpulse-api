import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { IJwtPayload } from '../modules/auth/auth.interface';
import AppError from '../utils/AppError';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new AppError('Access denied. No token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as IJwtPayload;
    req.user = decoded;
    next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
};

export default verifyToken;