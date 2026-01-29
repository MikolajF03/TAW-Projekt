import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Brak tokenu, dostęp zabroniony' });
  }

  try {
    const decoded = jwt.verify(token, 'TwojeSuperTajneHaslo');
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token jest nieprawidłowy' });
  }
};