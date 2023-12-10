import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import Patient from '../models/Patient';
import ProgramEnrollment from '../models/ProgramEnrollment';
import Caregiver from '../models/Caregiver';
import PatientCaregiver from '../models/PatientCaregiver';
import { sequelize } from '../db/database';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default class AuthServices {
  static async register(name: string, familyName: string, email: string, password: string, idPatients: any): Promise<string> {
    const hashedPassword = await AuthServices.hashPassword(password);

    const existingUser = await Patient.findOne({ where: { email } }) || await Caregiver.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    if (idPatients) {
      const caregiver = await AuthServices.createCaregiver(name, familyName, email, hashedPassword, idPatients);
      const token = AuthServices.generateJwtToken(caregiver);
      return token;
    } else {
      const patient = await AuthServices.createPatient(name, familyName, email, hashedPassword);
      const token = AuthServices.generateJwtToken(patient);
      return token;
    }
  }

  static async login(email: string, password: string): Promise<string> {
    const user = await Patient.findOne({ where: { email } }) || await Caregiver.findOne({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.Password);

    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = AuthServices.generateJwtToken(user);
    return token;
  }

  static async verifyToken(req: Request): Promise<{ status: number; message: string }> {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return { status: 401, message: 'No token, authorization denied' };
    }

    const jwtSecret = process.env.JWT_SECRET as string;
    const user = jwt.verify(token, jwtSecret) as User;

    if (!user) {
      return { status: 403, message: 'Missing program name' };
    }

    return { status: 200, message: 'Token is valid' };
  }

  static async changeProgram(req: Request): Promise<{ status: number; message: string }> {
    const token = req.header('Authorization')?.split(' ')[1];
    const programName = req.body.programName;

    if (!token) {
      return { status: 401, message: 'No token, authorization denied' };
    }

    const patient = await AuthServices.getPatientFromToken(token);

    await AuthServices.createProgramEnrollment(patient.idPatient, programName);
    return { status: 200, message: 'Program changed' };
  }

  // Helper functions
  static async getPatientFromToken(token: string): Promise<Patient> {
    const jwtSecret = process.env.JWT_SECRET as string;
    const user = jwt.verify(token, jwtSecret) as User;

    const patient = await Patient.findByPk(user.id);
    if (!patient) {
      throw new Error('Patient not found');
    }

    return patient;
  }

  static async createProgramEnrollment(idPatient: number, programName: string): Promise<ProgramEnrollment> {
    const programEnrollment = await ProgramEnrollment.create({
      PatientId: idPatient,
      ProgramName: programName,
      ProgramEnrollment: new Date(Date.now()),
    });

    return programEnrollment;
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async createPatient(firstName: string, lastName: string, email: string, password: string): Promise<Patient> {
    return Patient.create({
      PatientFirstName: firstName,
      PatientLastName: lastName,
      Email: email,
      Password: password,
    });
  }

  static async createCaregiver(firstName: string, lastName: string, email: string, password: string, idPatients: any): Promise<Caregiver> {
    const t = await sequelize.transaction();

    try {
      const caregiver = await Caregiver.create(
        {
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Password: password,
        },
        { transaction: t }
      );

      if (idPatients.length > 0) {
        const patientIds = idPatients.map((id: number) => ({ patient_id: id, caregiver_id: AuthServices.getPropertyByString(caregiver, 'id') }));
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

  static getPropertyByString(obj: any, searchString: string): any | undefined {
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

  static generateJwtToken(user: Patient | Caregiver): string {
    const payload: User = {
      id: AuthServices.getPropertyByString(user, 'id'),
      firstName: AuthServices.getPropertyByString(user, 'FirstName'),
      lastName: AuthServices.getPropertyByString(user, 'LastName'),
      email: user.Email,
      role: this.getUserRole(user),
    };

    const jwtSecret = process.env.JWT_SECRET as string;
    return jwt.sign(payload, jwtSecret, { expiresIn: process.env.TOKEN_EXPIRE_TIME });
  }

  private static getUserRole(user: Patient | Caregiver): string {
    if (user instanceof Patient) {
      return 'patient';
    } else if (user instanceof Caregiver) {
      return 'caregiver';
    } else {
      throw new Error('Invalid user type');
    }
  }
}
