import { Patient } from "../model/Patient";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import { SessionRecord } from "../model/SessionRecord";
import { generateCode, sendEmail } from "../util/unikpass"; // Assure-toi que le chemin est correct pour ton utilitaire
import * as bcrypt from "bcrypt";
import { Patient_Caregiver } from "../model/Patient_Caregiver";
import { Caregiver } from "../model/Caregiver";

/**
 * Creates a new patient.
 */
exports.createPatient = async (req: any, res: any, next: any) => {
  const {
    firstname,
    lastname,
    birthday,
    phoneNumber,
    email,
    otherinfo,
    numberOfCaregivers,
    status,
    numberOfPrograms,
    weight,
    weightUnit,
  } = req.body;

  // Générer un code unique
  const code = generateCode(6); // Appeler la fonction de génération de code avec 6 caractères

  // Hacher le code avant de le stocker dans la base de données
  const unikPassHashed = await bcrypt.hash(code, 10); // Utilisation de bcrypt pour hacher le code
  try {
    const existingUser = await Patient.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "existing patient with this email." });
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
      weightUnit,
      unikPassHashed,
    });
    await sendEmail(email, "Votre code d'accès RXAPA", code); // Envoie le code d'accès par e-mail
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
  const {
    firstname,
    lastname,
    birthday,
    phoneNumber,
    email,
    otherinfo,
    status,
    numberOfPrograms,
  } = req.body;
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
 * Update an existing patient who has one or more caregivers.
 */
exports.updatePatientWithCaregivers = async (req: any, res: any, next: any) => {
  const patientId = req.params.id;
  const {
    firstname,
    lastname,
    phoneNumber,
    email,
    status,
    numberOfPrograms,
    numberOfCaregivers,
    role,
    weight,
    weightUnit,
    birthday,
    caregivers,
  } = req.body;
  try {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patient.firstname = firstname;
    patient.lastname = lastname;
    patient.phoneNumber = phoneNumber;
    patient.email = email;
    patient.status = status;
    patient.numberOfPrograms = numberOfPrograms;
    patient.role = role;
    patient.weight = weight;
    patient.weightUnit = weightUnit;
    patient.birthday = birthday;
    patient.numberOfCaregivers = numberOfCaregivers;
    await patient.save();

    if (caregivers) {
      for (const caregiver of caregivers) {
        const caregiverInstance = await Caregiver.findByPk(caregiver.id);
        if (caregiverInstance) {
          caregiverInstance.firstname = caregiver.firstname;
          caregiverInstance.lastname = caregiver.lastname;
          caregiverInstance.phoneNumber = caregiver.phoneNumber;
          caregiverInstance.email = caregiver.email;
          caregiverInstance.relationship = caregiver.relationship;
          await caregiverInstance.save();
        }
      }
    }
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
    res
      .status(error.statusCode)
      .json({ message: "Error loading patient from the database" });
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
    res
      .status(error.statusCode)
      .json({ message: "Error loading patients from the database" });
  }
  return res;
};

exports.getPatientSessions = async (req: any, res: any, next: any) => {
  const patientId = parseInt(req.params.id, 10);

  try {
    // Récupérer les programmes du patient
    const patientPrograms = await ProgramEnrollement.findAll({
      where: { PatientId: patientId },
    });

    // Récupérer les IDs des programmes du patient
    const programIds = patientPrograms.map(
      (pp: typeof ProgramEnrollement) => pp.id
    );

    // Récupérer les sessions associées à ces programmes
    const sessions = await SessionRecord.findAll({
      where: { ProgramEnrollementId: programIds },
    });

    // Renvoyer les sessions au client
    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching patient sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPatientDetails = async (req: any, res: any, next: any) => {
  try {
    const patientId = req.params.id;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const programEnrollements = await ProgramEnrollement.findAll({
      where: { PatientId: patientId },
    });

    if (!programEnrollements.length) {
      return res.status(200).json({
        caregivers: [],
        patientCaregivers: [],
        programEnrollements: [],
      });
    }

    const allPatientCaregivers = await Patient_Caregiver.findAll();

    const PatientCaregivers = allPatientCaregivers.filter(
      (patientCaregiver: { ProgramEnrollementId: any }) =>
        programEnrollements.some(
          (enrollment: { id: any }) =>
            enrollment.id === patientCaregiver.ProgramEnrollementId
        )
    );

    if (!PatientCaregivers.length) {
      return res
        .status(404)
        .json({ message: "No caregivers found for this patient" });
    }

    // Extraction des IDs des soignants
    const caregiverIds = PatientCaregivers.map(
      (pc: { CaregiverId: any }) => pc.CaregiverId
    );

    const caregivers = await Caregiver.findAll({
      where: { id: caregiverIds }, // Filtrage avec les IDs extraits
    });

    if (!caregivers.length) {
      return res.status(404).json({ message: "No caregivers details found" });
    }

    // Retourner les données sous forme de JSON
    res.status(200).json({
      caregivers,
      patientCaregivers: PatientCaregivers,
      programEnrollements,
    });
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
