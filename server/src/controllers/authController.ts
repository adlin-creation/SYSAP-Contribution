import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient';
import { JwtPayload } from '../types/jwtTypes';
import * as dotenv from 'dotenv';
import ProgramEnrollment from '../models/ProgramEnrollment';

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

  static changeProgram = async (req: Request, res: Response) => {
    try {
      const token = req.header('Authorization')?.split(' ')[1];
      const programName = req.body.programName;

      if (!token) {
        
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }

      const patient = await getPatientFromToken(token);

      const ProgramEnrollment = await createProgramEnrollment(patient.idPatient, programName);
      
      console.log(ProgramEnrollment);
      
      res.status(200).json({ msg: 'Program changed' });
    } catch (err: any){
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
}

async function getPatientFromToken(token: string): Promise<Patient> {
  const jwtSecret = process.env.JWT_SECRET as string;
  const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

  const patient = await Patient.findByPk(decoded.patient.id);
  if (!patient) {
    throw new Error('Patient not found');
  }

  console.log(patient);

  return patient;
}

async function createProgramEnrollment(idPatient: number, programName: string): Promise<ProgramEnrollment> {
  console.log(idPatient + ", " +  programName)
  return ProgramEnrollment.create({
    Patientld: idPatient,
    ProgramName: programName,
  });
}

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function createPatient(firstName: string, lastName: string, email: string, password: string): Promise<Patient> {
  return Patient.create({
    PatientFirstName: firstName,
    PatientLastName: lastName,
    Email: email,
    Password: password,
  });
}

function generateJwtToken(patient: Patient) {
  const payload: JwtPayload = {
    patient: {
      id: patient.idPatient,
      firstName: patient.PatientFirstName,
      lastName: patient.PatientLastName,
      email: patient.Email,
    },
  };
  const jwtSecret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, jwtSecret, { expiresIn: process.env.TOKEN_EXPIRE_TIME });
}
