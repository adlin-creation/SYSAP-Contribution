import { Patient } from "../model/Patient";
import { extractEmailFromToken, generateCode, sendEmail } from '../util/unikpass'; // Assure-toi que le chemin est correct pour ton utilitaire
import jwt from 'jsonwebtoken';

// import * as bcrypt from 'bcrypt';

/**
 * Creates a new patient.
 */
exports.createPatient = async (req: any, res: any, next: any) => {
  const { firstname, lastname, birthday, phoneNumber, email, otherinfo, numberOfCaregivers, status, numberOfPrograms, weight, weightUnit } = req.body;

  // Générer un code unique
  const code = generateCode(6); // Appeler la fonction de génération de code avec 6 caractères

  // Hacher le code avant de le stocker dans la base de données
  // const unikPassHashed = await bcrypt.hash(code, 10);  // Utilisation de bcrypt pour hacher le code
  try {

    const existingUser = await Patient.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "existing patient with this email." });
    }

    const newPatient = await Patient.create({
      firstname,
      lastname,
      birthday,
      phoneNumber,
      email,
      otherinfo,
      numberOfCaregivers,
      status: status || "waiting", // Utilise "waiting" si status n'est pas fourni
      numberOfPrograms: numberOfPrograms,
      weight,
      weightUnit
      // unikPassHashed
    });
    await sendEmail(email, code);
    res.status(201).json(newPatient);

  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error creating patient" });
  }
  return res;
};

/**
 * Updates an existing patient.
 */
exports.updatePatient = async (req: any, res: any, next: any) => {
  const patientId = req.params.id;
  const { firstname, lastname, birthday, phoneNumber, email, otherinfo, status, numberOfPrograms } = req.body;
  try {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patient.firstname = firstname;
    patient.lastname = lastname;
    patient.birthday = birthday;
    patient.phoneNumber = phoneNumber;
    patient.email = email;
    patient.otherinfo = otherinfo;
    patient.status = status;
    patient.numberOfPrograms = numberOfPrograms;
    await patient.save();
    res.status(200).json(patient);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error updating patient" });
  }
  return res;
};

/**
 * Deletes a patient.
 */
exports.deletePatient = async (req: any, res: any, next: any) => {
  const patientId = req.params.id;
  try {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    await patient.destroy();
    res.status(200).json({ message: "Patient deleted" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error deleting patient" });
  }
  return res;
};

/**
 * Returns a specific patient based on their ID.
 */
exports.getPatient = async (req: any, res: any, next: any) => {
  const patientId = req.params.id;
  try {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error loading patient from the database" });
  }
  return res;
};

/**
 * Returns all patients.
 */
exports.getPatients = async (req: any, res: any, next: any) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).json(patients);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error loading patients from the database" });
  }
  return res;
};
