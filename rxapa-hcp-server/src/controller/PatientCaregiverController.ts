import { Patient_Caregiver } from "../model/Patient_Caregiver";

/**
 * Creates a new patient-caregiver association.
 */
exports.createPatientCaregiver = async (req: any, res: any, next: any) => {
  const { date, ProgramEnrollementId, CaregiverId, PatientId } = req.body;
  console.log(req);
  try {
    const programCaregivers = await Patient_Caregiver.findAll({ where: { ProgramEnrollementId } });
    if (programCaregivers.length >= 2) {
      return res.status(400).json({ message: "A program enrollement can have a maximum of 2 caregivers" });
    }
    const newPatientCaregiver = await Patient_Caregiver.create({
      date,
      ProgramEnrollementId,
      CaregiverId,
      PatientId
    });
    res.status(201).json(newPatientCaregiver);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error creating patient-caregiver association" });
  }
  return res;
};

/**
 * Updates an existing patient-caregiver association.
 */
exports.updatePatientCaregiver = async (req: any, res: any, next: any) => {
  const patientCaregiverId = req.params.id;
  const { date, ProgramEnrollementId, CaregiverId } = req.body;
  try {
    const patientCaregiver = await Patient_Caregiver.findByPk(patientCaregiverId);
    if (!patientCaregiver) {
      return res.status(404).json({ message: "Patient-caregiver association not found" });
    }
    patientCaregiver.date = date;
    patientCaregiver.ProgramEnrollementId = ProgramEnrollementId;
    patientCaregiver.CaregiverId = CaregiverId;
    await patientCaregiver.save();
    res.status(200).json(patientCaregiver);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error updating patient-caregiver association" });
  }
  return res;
};

/**
 * Deletes a patient-caregiver association.
 */
exports.deletePatientCaregiver = async (req: any, res: any, next: any) => {
  const patientCaregiverId = req.params.id;
  try {
    const patientCaregiver = await Patient_Caregiver.findByPk(patientCaregiverId);
    if (!patientCaregiver) {
      return res.status(404).json({ message: "Patient-caregiver association not found" });
    }
    await patientCaregiver.destroy();
    res.status(200).json({ message: "Patient-caregiver association deleted" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error deleting patient-caregiver association" });
  }
  return res;
};

/**
 * Returns a specific patient-caregiver association based on its ID.
 */
exports.getPatientCaregiver = async (req: any, res: any, next: any) => {
  const patientCaregiverId = req.params.id;
  try {
    const patientCaregiver = await Patient_Caregiver.findByPk(patientCaregiverId);
    if (!patientCaregiver) {
      return res.status(404).json({ message: "Patient-caregiver association not found" });
    }
    res.status(200).json(patientCaregiver);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error loading patient-caregiver association from the database" });
  }
  return res;
};

/**
 * Returns all patient-caregiver associations.
 */
exports.getPatientCaregivers = async (req: any, res: any, next: any) => {
  try {
    const patientCaregivers = await Patient_Caregiver.findAll();
    res.status(200).json(patientCaregivers);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error loading patient-caregiver associations from the database" });
  }
  return res;
};