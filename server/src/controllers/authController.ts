import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient';
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

      const existingPatient = await Patient.findOne({ where: { email } });
      if (existingPatient) {
        return res.status(400).json({ msg: 'Email already registered' });
      }

      const hashedPassword = await hashPassword(password);

      const newPatient = await createPatient(name, familyName, email, hashedPassword);

      const token = generateJwtToken(newPatient);

      res.json({ token });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const patient = await Patient.findOne({ where: { email } });

      if (!patient) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const isPasswordMatch = await bcrypt.compare(password, patient.Password);

      if (!isPasswordMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const token = generateJwtToken(patient);

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

async function createPatient(name: string, familyName: string, email: string, password: string): Promise<Patient> {
  return Patient.create({
    Name: name,
    FamilyName: familyName,
    Email: email,
    Password: password,
  });
}

function generateJwtToken(patient: Patient) {
  const expirationTime = 60 * 60 * 24 * 7; // 7 days
  const payload: JwtPayload = {
    patient: {
      id: patient.idPatient,
      name: patient.Name,
      familyName: patient.FamilyName,
      email: patient.Email,
      programName: "",
    },
  };
  const jwtSecret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, jwtSecret, { expiresIn: expirationTime });
}
