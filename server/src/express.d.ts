import { JwtPayload } from './types/jwtTypes';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload['user'];
    }
  }
}