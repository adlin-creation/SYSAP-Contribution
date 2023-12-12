import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import AuthServices from '../services/authService';

dotenv.config({ path: './src/config/config.env' });

export default class AuthController {
  static register = async (req: Request, res: Response) => {
    try {
      const { name, familyName, email, password, idPatients } = req.body;

      const token = await AuthServices.register(name, familyName, email, password, idPatients);

      return res.json({ token });
    } catch (err: any) {
      console.error(err);
      return res.status(500).send('Server Error');
    }
  }

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const token = await AuthServices.login(email, password);

      return res.json({ token });
    } catch (err: any) {
      return res.status(500).send('Server Error');
    }
  }

  static verifyToken = async (req: Request, res: Response) => {
    try {
      const result = await AuthServices.verifyToken(req);

      return res.status(result.status).json({ msg: result.message });
    } catch (err: any) {
      return res.status(500).send('Server Error');
    }
  }

  static changeProgram = async (req: Request, res: Response) => {
    try {
      const result = await AuthServices.changeProgram(req);

      return res.status(result.status).json({ msg: result.message });
    } catch (err: any) {
      return res.status(500).send('Server Error');
    }
  }
}