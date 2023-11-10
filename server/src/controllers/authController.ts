import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { JwtPayload } from '../types/jwtTypes';
import * as dotenv from 'dotenv';

dotenv.config({ path: './src/config/config.env' });

export default class AuthController {
  static register = async (req: Request, res: Response) => {
    try {
      const { name, familyName, email, password } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email already registered' });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await createUser(name, familyName, email, hashedPassword);

      const token = generateJwtToken(newUser);

      res.json({ token });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.Password);

      if (!isPasswordMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const token = generateJwtToken(user);

      res.json({ token });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
}

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function createUser(name: string, familyName: string, email: string, password: string): Promise<User> {
  return User.create({
    Name: name,
    FamilyName: familyName,
    Email: email,
    Password: password,
  });
}

function generateJwtToken(user: User) {
  const expirationTime = 60 * 60 * 24 * 7; // 7 days
  const payload: JwtPayload = {
    user: {
      id: user.idUser,
      name: user.Name,
      familyName: user.FamilyName,
      email: user.Email,
      programName: "",
    },
  };
  const jwtSecret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, jwtSecret, { expiresIn: expirationTime });
}
