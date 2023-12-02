import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient';
import { JwtPayload } from '../types/jwtTypes';
import * as dotenv from 'dotenv';
import ProgramEnrollment from '../models/ProgramEnrollment';
import Caregiver from '../models/Caregiver';
import PatientCaregiver from '../models/PatientCaregiver';

dotenv.config({ path: './src/config/config.env' });

export default class AuthController {
  static register = async (req: Request, res: Response) => {
    try {
        const { name, familyName, email, password, idPatients } = req.body;

        const hashedPassword = await hashPassword(password);

        // Create the user (Patient or Caregiver)
        if (idPatients){
          const existingCaregiver = await Caregiver.findOne({ where: { email } });
          if (existingCaregiver) {
            return res.status(400).json({ msg: 'Email already registered' });
          }
          const caregiver = await createCaregiver(name, familyName, email, hashedPassword, idPatients);
          const token = generateJwtToken(caregiver);
          return res.json({ token });
        }
        else{
          const existingPatient = await Patient.findOne({ where: { email } });
          if (existingPatient) {
            return res.status(400).json({ msg: 'Email already registered' });
          }
          const patient = await createPatient(name, familyName, email, hashedPassword);
          const token = generateJwtToken(patient);

          return res.json({ token });
        }
    } catch (err: any) {
      return res.status(500).send('Server Error');
    }
  }

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

      return res.json({ token });
    } catch (err: any) {
      return res.status(500).send('Server Error');
    }
  }

  static verifyToken = async (req: Request, res: Response) => {
    try{
      const token = req.header('Authorization')?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }
    
      const jwtSecret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
  
      if (!decoded.user){
        return res.status(403).json({ msg: 'Missing program name' });
      }

      return res.status(200).json({ msg: 'token is valid'});
    } catch (err: any) {
      return res.status(500).send('Server Error');
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

      await createProgramEnrollment(patient.idPatient, programName);
      
      return res.status(200).json({ msg: 'Program changed' });
    } catch (err: any){
      return res.status(500).send('Server Error');
    }
  }
}

async function getPatientFromToken(token: string): Promise<Patient> {
  const jwtSecret = process.env.JWT_SECRET as string;
  const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

  const patient = await Patient.findByPk(decoded.user.id);
  if (!patient) {
    throw new Error('Patient not found');
  }

  return patient;
}

async function createProgramEnrollment(idPatient: number, programName: string): Promise<ProgramEnrollment> {
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

function generateJwtToken(user: Patient | Caregiver) {
  const idProp = getPropertyByString(user, "id");
  
  const payload: JwtPayload = {
    user: {
      id: getPropertyByString(user, "id"),
      firstName: getPropertyByString(user, "FirstName"),
      lastName: getPropertyByString(user, "LastName"),
      email: user.Email,
    },
  };
  const jwtSecret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, jwtSecret, { expiresIn: process.env.TOKEN_EXPIRE_TIME });
}

function getPropertyByString(obj: any, searchString: string): any | undefined {
  if (obj === null || obj === undefined || !obj.dataValues) {
    return undefined;
  }

  const keys = Object.keys(obj.dataValues);

  for (const key of keys) {
    if (obj.dataValues.hasOwnProperty(key) && key.includes(searchString)) {
      return obj.dataValues[key];
    }
  }
  return undefined;
}

async function createCaregiver(firstName: string, lastName: string, email: string, password: string, idPatients: any): Promise<Caregiver> {
  
  const caregiver = await Caregiver.create({
    FirstName: firstName,
    LastName: lastName,
    Email: email,
    Password: password,
  });

  if (idPatients.length > 0) {
    const patientIds = idPatients.map((id: number) => ({ patient_id: id, caregiver_id:  getPropertyByString(caregiver, "id") }));
    await PatientCaregiver.bulkCreate(patientIds);
    console.log(patientIds)
  }

  return caregiver;
}

