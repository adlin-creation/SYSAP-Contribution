import { Patient_Caregiver } from "../model/Patient_Caregiver";

/**
 * Creates a new patient-caregiver association.
 */
exports.createPatientCaregiver = async (req: any, res: any, next: any) => {
  const { date, ProgramEnrollementId, CaregiverId, PatientId } = req.body;
  console.log(req);
  try {
    const programCaregivers = await Patient_Caregiver.findAll({
      where: { ProgramEnrollementId },
    });
    if (programCaregivers.length >= 2) {
      return res.status(400).json({
        message: "program_enrollment_max_caregivers",
      });
    }
    const newPatientCaregiver = await Patient_Caregiver.create({
      date,
      ProgramEnrollementId,
      CaregiverId,
      PatientId,
    });
    res.status(201).json(newPatientCaregiver);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "error_creating_patient_caregiver_association" });
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
    const patientCaregiver = await Patient_Caregiver.findByPk(
      patientCaregiverId
    );
    if (!patientCaregiver) {
      return res
        .status(404)
        .json({ message: "patient_caregiver_association_not_found" });
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
    res
      .status(error.statusCode)
      .json({ message: "error_updating_patient_caregiver_association" });
  }
  return res;
};

/**
 * Deletes a patient-caregiver association.
 */
exports.deletePatientCaregiver = async (req: any, res: any, next: any) => {
  const patientCaregiverId = req.params.id;
  try {
    const patientCaregiver = await Patient_Caregiver.findByPk(
      patientCaregiverId
    );
    if (!patientCaregiver) {
      return res
        .status(404)
        .json({ message: "patient_caregiver_association_not_found" });
    }
    await patientCaregiver.destroy();
    res.status(200).json({ message: "patient_caregiver_association_deleted" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "error_deleting_patient_caregiver_association" });
  }
  return res;
};

/**
 * Returns a specific patient-caregiver association based on its ID.
 */
exports.getPatientCaregiver = async (req: any, res: any, next: any) => {
  const patientCaregiverId = req.params.id;
  try {
    const patientCaregiver = await Patient_Caregiver.findByPk(
      patientCaregiverId
    );
    if (!patientCaregiver) {
      return res
        .status(404)
        .json({ message: "patient_caregiver_association_not_found" });
    }
    res.status(200).json(patientCaregiver);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({
      message: "error_loading_patient_caregiver_association",
    });
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
    res.status(error.statusCode).json({
      message: "error_loading_patient_caregiver_association",
    });
  }
  return res;
};
