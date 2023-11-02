import User from './src/models/User'; // Import your User model or define the user type as needed

declare global {
  namespace Express {
    interface Request {
      user: User; // Add the 'user' property to Request
    }
  }
}