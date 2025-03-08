import { Patient } from "../model/Patient";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import { SessionRecord } from "../model/SessionRecord";

/**
 * Creates a new patient.
 */
exports.createPatient = async (req: any, res: any, next: any) => {
  const { firstname, lastname, birthday, phoneNumber, email, otherinfo, status, numberOfPrograms } = req.body;
  try {
    const newPatient = await Patient.create({
      firstname,
      lastname,
      birthday,
      phoneNumber,
      email,
      otherinfo,
      status: status || "waiting", // Utilise "waiting" si status n'est pas fourni
      numberOfPrograms
    });
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

exports.getPatientSessions = async (req: any, res: any, next: any) => {
  const patientId = parseInt(req.params.id, 10);

  try {
    // Récupérer les programmes du patient
    const patientPrograms = await ProgramEnrollement.findAll({
      where: { PatientId: patientId },
    });

    // Récupérer les IDs des programmes du patient
    const programIds = patientPrograms.map((pp: typeof ProgramEnrollement) => pp.id);

    // Récupérer les sessions associées à ces programmes
    const sessions = await SessionRecord.findAll({
      where: { ProgramEnrollementId: programIds },
    });

    // Renvoyer les sessions au client
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching patient sessions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
