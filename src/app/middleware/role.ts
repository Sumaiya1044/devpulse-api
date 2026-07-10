import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

const verifyRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Access denied. Not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied. Insufficient permissions', 403));
    }

    next();
  };
};

export default verifyRole;