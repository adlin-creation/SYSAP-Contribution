import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from 'config';

// Handle user registration
export const register = async (req: Request, res: Response) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, familyName, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already registered' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
      name,
      familyName,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token for the user
    const payload = { user: { id: newUser.id } };
    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Handle user login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate a JWT token for the user using the config object
    const jwtSecret = config.get('jwtSecret');
    const payload = { user: { id: user.id } };
    jwt.sign(payload, jwtSecret, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

import authMiddleware from '../middlewares/authMiddleware'; // Import your authentication middleware

// Get authenticated user
export const getAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    // Use the user from the authentication middleware
    const user = req.user;

    res.json({ msg: `Hello ${user.name}`, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};