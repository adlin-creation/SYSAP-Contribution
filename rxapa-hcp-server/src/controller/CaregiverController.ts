import { Caregiver } from "../model/Caregiver";
import { Patient_Caregiver } from "../model/Patient_Caregiver";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import { Patient } from "../model/Patient";

/**
 * Creates a new caregiver.
 */
exports.createCaregiver = async (req: any, res: any, next: any) => {
  const { firstname, lastname, phoneNumber, email, relationship } = req.body;
  try {
    const newCaregiver = await Caregiver.create({
      firstname,
      lastname,
      phoneNumber,
      email,
      relationship
    });
    res.status(201).json(newCaregiver);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error creating caregiver" });
  }
  return res;
};

/**
 * Updates an existing caregiver.
 */
exports.updateCaregiver = async (req: any, res: any, next: any) => {
  const caregiverId = req.params.id;
  const { firstname, lastname, phoneNumber, email, relationship } = req.body;
  try {
    const caregiver = await Caregiver.findByPk(caregiverId);
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }
    caregiver.firstname = firstname;
    caregiver.lastname = lastname;
    caregiver.phoneNumber = phoneNumber;
    caregiver.email = email;
    caregiver.relationship = relationship;
    await caregiver.save();
    res.status(200).json(caregiver);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error updating caregiver" });
  }
  return res;
};

/**
 * Deletes a caregiver.
 */
exports.deleteCaregiver = async (req: any, res: any, next: any) => {
  const caregiverId = req.params.id;
  try {
    const caregiver = await Caregiver.findByPk(caregiverId);
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }
    await caregiver.destroy();
    res.status(200).json({ message: "Caregiver deleted" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error deleting caregiver" });
  }
  return res;
};

/**
 * Returns a specific caregiver based on their ID.
 */
exports.getCaregiver = async (req: any, res: any, next: any) => {
  const caregiverId = req.params.id;
  try {
    const caregiver = await Caregiver.findByPk(caregiverId);
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }
    res.status(200).json(caregiver);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error loading caregiver from the database" });
  }
  return res;
};

/**
 * Returns all caregivers.
 */
exports.getCaregivers = async (req: any, res: any, next: any) => {
  try {
    const caregivers = await Caregiver.findAll();
    res.status(200).json(caregivers);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error loading caregivers from the database" });
  }
  return res;
};

/**
 * Returns all patients associated with a specific caregiver.
 */
exports.getPatientsByCaregiver = async (req: any, res: any, next: any) => {
  const caregiverId = req.params.id;
  try {
    const caregiver = await Caregiver.findByPk(caregiverId);
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    const patients = await Patient.findAll({
      include: [{
        model: ProgramEnrollement,
        required: true,  // Ajout de required: true
        include: [{
          model: Patient_Caregiver,
          where: { CaregiverId: caregiverId },
          required: true  // Ajout de required: true
        }]
      }]
    });

    if (!patients.length) {
      return res.status(200).json({ message: "No patients found for this caregiver", patients: [] });
    }

    res.status(200).json(patients);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ 
      message: "Error loading patients for caregiver from the database",
      error: error.message 
    });
  }
  return res;
};
