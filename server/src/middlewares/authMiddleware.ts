import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwtTypes';
import * as dotenv from 'dotenv';
dotenv.config({ path: './config/config.env' });

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decoded.user.programName){
      return res.status(403).json({ msg: 'Missing program name' });
    }
    req.user = decoded.user;
    next();
  } catch (err: any) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}
export const getAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    res.json({ msg: `Hello ${user!.name}`, user });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
