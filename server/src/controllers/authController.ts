import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient';
import * as dotenv from 'dotenv';
import ProgramEnrollment from '../models/ProgramEnrollment';
import Caregiver from '../models/Caregiver';
import PatientCaregiver from '../models/PatientCaregiver';
import { sequelize } from '../db/database';

dotenv.config({ path: './src/config/config.env' });

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

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
          console.log(caregiver);
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
      console.log(err);
      return res.status(500).send('Server Error');
    }
  }

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await Patient.findOne({ where: { email } }) || await Caregiver.findOne({ where: { email }});

      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.Password);

      if (!isPasswordMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const token = generateJwtToken(user);

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
      const user = jwt.verify(token, jwtSecret) as User;
  
      if (!user){
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
  const user = jwt.verify(token, jwtSecret) as User;

  const patient = await Patient.findByPk(user.id);
  if (!patient) {
    throw new Error('Patient not found');
  }

  return patient;
}

async function createProgramEnrollment(idPatient: number, programName: string): Promise<ProgramEnrollment> {
  const programEnrollment = await ProgramEnrollment.create({
    PatientId: idPatient,
    ProgramName: programName,
    ProgramEnrollment: new Date(Date.now())
  });

  return programEnrollment
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
  
  const payload: User = {
      id: getPropertyByString(user, "id"),
      firstName: getPropertyByString(user, "FirstName"),
      lastName: getPropertyByString(user, "LastName"),
      email: user.Email,
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

  const t = await sequelize.transaction();

  try {
    const caregiver = await Caregiver.create({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Password: password,
    }, { transaction: t });

    if (idPatients.length > 0) {
      const patientIds = idPatients.map((id: number) => ({ patient_id: id, caregiver_id: getPropertyByString(caregiver, "id") }));
      await PatientCaregiver.bulkCreate(patientIds, { transaction: t });
    }

    await t.commit();

    return caregiver;
  } catch (error) {
    console.log(error);
    await t.rollback();
    throw error;
  }
}

