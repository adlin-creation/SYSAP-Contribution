import { Caregiver } from "../model/Caregiver";
import { Patient_Caregiver } from "../model/Patient_Caregiver";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import { Patient } from "../model/Patient";
import { sequelize } from "../util/database"; // Ajout de l'import de l'instance sequelize

/**
 * Creates a new caregiver.
 */
exports.createCaregiver = async (req: any, res: any, next: any) => {
  const { firstname, lastname, phoneNumber, email, relationship } = req.body;

  try {
    const existingUser = await Caregiver.findOne({ where: { email } });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "existing caregiver with this email." });
    }
    const newCaregiver = await Caregiver.create({
      firstname,
      lastname,
      phoneNumber,
      email,
      relationship,
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
export const deleteCaregiver = async (req: any, res: any, next: any) => {
  const caregiverId = req.params.id;

  try {
    // Trouver le soignant
    const caregiver = await Caregiver.findByPk(caregiverId);
    if (!caregiver) {
      return res.status(404).json({ message: "Caregiver not found" });
    }

    // Trouver la relation Patient-Caregiver
    const patient_Caregiver = await Patient_Caregiver.findOne({
      where: {
        CaregiverId: caregiver.id,
      },
    });

    if (!patient_Caregiver) {
      return res
        .status(404)
        .json({ message: "Patient-Caregiver relation not found" });
    }

    // Trouver l'enregistrement de programme
    const program_Enrollement = await ProgramEnrollement.findByPk(
      patient_Caregiver.ProgramEnrollementId
    );
    if (!program_Enrollement) {
      return res.status(404).json({ message: "Program Enrollement not found" });
    }

    // Trouver le patient associé
    const patient = await Patient.findByPk(program_Enrollement.PatientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Trouver tous les enregistrements de programmes du patient
    const programs_Enrollements_patient = await ProgramEnrollement.findAll({
      where: {
        PatientId: patient.id,
      },
    });

    const occurrences = programs_Enrollements_patient.reduce(
      (acc: number, program: { dataValues: { ProgramId: string } }) => {
        return program.dataValues.ProgramId === program_Enrollement.ProgramId
          ? acc + 1
          : acc;
      },
      0 // Accumulateur initialisé à 0
    );

    if (occurrences === 1) {
      patient.numberOfPrograms -= 1;
    }

    // Toujours décrémenter le nombre de soignants
    patient.numberOfCaregivers -= 1;

    // Démarrer la transaction
    const transaction = await sequelize.transaction();

    try {
      // Enregistrer les modifications du patient
      await patient.save({ transaction });

      // Supprimer le soignant, la relation patient-soignant et l'enregistrement de programme
      await patient_Caregiver.destroy({ transaction });
      await program_Enrollement.destroy({ transaction });
      await caregiver.destroy({ transaction });

      // Commit de la transaction si tout se passe bien
      await transaction.commit();

      res.status(200).json({ message: "Caregiver deleted" });
    } catch (error) {
      // Rollback en cas d'erreur
      await transaction.rollback();
      console.error("Transaction failed:", error);
      res.status(500).json({ message: "Error deleting caregiver" });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Error processing request" });
  }
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
    res
      .status(error.statusCode)
      .json({ message: "Error loading caregiver from the database" });
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
    res
      .status(error.statusCode)
      .json({ message: "Error loading caregivers from the database" });
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
      include: [
        {
          model: ProgramEnrollement,
          required: true, // Ajout de required: true
          include: [
            {
              model: Patient_Caregiver,
              where: { CaregiverId: caregiverId },
              required: true, // Ajout de required: true
            },
          ],
        },
      ],
    });

    if (!patients.length) {
      return res.status(200).json({
        message: "No patients found for this caregiver",
        patients: [],
      });
    }

    res.status(200).json(patients);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({
      message: "Error loading patients for caregiver from the database",
      error: error.message,
    });
  }
  return res;
};

/**
 * Returns all caregivers associated with a specific patient.
 */
exports.getCaregiversByPatient = async (req: any, res: any, next: any) => {
  const patientId = req.params.id;
  try {
    const programEnrollements = await ProgramEnrollement.findAll({
      where: { PatientId: patientId },
    });
    if (!programEnrollements.length) {
      return res.status(200).json({
        message: "No program enrollements found for this patient",
        caregivers: [],
      });
    }
    let patientCaregiving: (typeof Patient_Caregiver)[] = [];
    for (const element of programEnrollements) {
      patientCaregiving = patientCaregiving.concat(
        await Patient_Caregiver.findAll({
          where: { ProgramEnrollementId: element.id },
        })
      );
    }

    if (!patientCaregiving.length) {
      return res.status(200).json({
        message: "No Patient_caregiver found for this patient",
        caregivers: [],
      });
    }
    let caregivers: (typeof Caregiver)[] = [];
    for (const element of patientCaregiving) {
      caregivers = caregivers.concat(
        await Caregiver.findAll({
          where: { id: element.CaregiverId },
        })
      );
    }

    if (!caregivers.length) {
      return res.status(200).json({
        message: "No caregivers found for this patient",
        caregivers: [],
      });
    }
    res.status(200).json(caregivers);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({
      message: "Error loading caregivers for patient from the database",
      error: error.message,
    });
  }
  return res;
};
