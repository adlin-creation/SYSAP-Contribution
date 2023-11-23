import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwtTypes';
import * as dotenv from 'dotenv';
dotenv.config({ path: './config/config.env' });

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decoded.patient){
      return res.status(403).json({ msg: 'Missing program name' });
    }
    req.user = decoded.patient;
    next();
  } catch (err: any) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}
