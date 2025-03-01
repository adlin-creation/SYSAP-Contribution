import { ProgramEnrollement } from "../model/ProgramEnrollement";
import { Patient_Caregiver } from "../model/Patient_Caregiver";
import { Program } from "../model/Program";
import { Patient } from "../model/Patient";
import { Caregiver } from "../model/Caregiver";
import { sequelize } from "../util/database"; // Ajout de l'import de l'instance sequelize

/**
 * Creates a new program enrollement.
 */
exports.createProgramEnrollement = async (req: any, res: any, next: any) => {
  const { enrollementDate, startDate, endDate, programEnrollementCode, ProgramId, PatientId } = req.body;
  try {
    const newProgramEnrollement = await ProgramEnrollement.create({
      enrollementDate,
      startDate,
      endDate,
      programEnrollementCode,
      ProgramId,
      PatientId
    });
    res.status(201).json(newProgramEnrollement);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error creating program enrollement" });
  }
  return res;
};

/**
 * Creates a new patient with caregivers using the "Sans programme" (ID=1) program
 */
exports.createPatientWithCaregivers = async (req: any, res: any, next: any) => {
  const { patientData, caregivers } = req.body;
  const transaction = await sequelize.transaction();

  try {
    // Validation des données patient
    if (!patientData) {
      throw new Error('Patient data is required');
    }

    // Validation des caregivers
    if (!caregivers || !Array.isArray(caregivers) || caregivers.length === 0) {
      throw new Error('At least one caregiver is required');
    }

    if (caregivers.length > 2) {
      throw new Error('Maximum 2 caregivers allowed per patient');
    }

    // 1. Créer le patient avec status "waiting"
    const newPatient = await Patient.create({
      ...patientData,
      status: "waiting"  // Ajout du status par défaut
    }, { transaction });

    // 2. Créer le program enrollment avec "Sans programme" (ID=1)
    const programEnrollment = await ProgramEnrollement.create({
      enrollementDate: new Date(),
      startDate: new Date(),
      endDate: null,
      programEnrollementCode: `SP-${newPatient.id}`, // SP pour "Sans Programme"
      ProgramId: 1, // ID du programme "Sans programme"
      PatientId: newPatient.id
    }, { transaction });

    // 3. Créer et associer les caregivers
    const createdCaregivers = await Promise.all(caregivers.map(caregiverData =>
      Caregiver.create(caregiverData, { transaction })
    ));

    // 4. Créer les associations Patient_Caregiver
    await Promise.all(createdCaregivers.map(caregiver =>
      Patient_Caregiver.create({
        date: new Date(),
        ProgramEnrollementId: programEnrollment.id,
        CaregiverId: caregiver.id,
        PatientId: newPatient.id
      }, { transaction })
    ));

    await transaction.commit();

    res.status(201).json({
      patient: newPatient,
      enrollment: programEnrollment,
      caregivers: createdCaregivers
    });
  } catch (error: any) {
    await transaction.rollback();
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ 
      message: "Error creating patient with caregivers",
      error: error.message 
    });
  }
  return res;
};

/**
 * Creates a new program enrollement and assigns caregivers simultaneously.
 */
// exports.createProgramEnrollementWithCaregivers = async (req: any, res: any, next: any) => {
//   const { enrollementDate, startDate, endDate, programEnrollementCode, ProgramId, PatientId, caregivers } = req.body;
//   const transaction = await sequelize.transaction(); // Utilisation de l'instance sequelize

//   try {
//     // Validation des champs requis
//     if (!enrollementDate || !startDate || !endDate || !programEnrollementCode || !ProgramId || !PatientId) {
//       throw new Error('All fields are required');
//     }

//     // Validation du format des dates
//     if (!Date.parse(enrollementDate) || !Date.parse(startDate) || !Date.parse(endDate)) {
//       throw new Error('Invalid date format');
//     }

//     // Validation des caregivers
//     if (!caregivers || !Array.isArray(caregivers) || caregivers.length === 0) {
//       throw new Error('Caregivers array is required');
//     }

//     // Vérification que le Programme existe
//     const program = await Program.findByPk(ProgramId);
//     if (!program) {
//       throw new Error('Program not found');
//     }

//     // Vérification que le Patient existe
//     const patient = await Patient.findByPk(PatientId);
//     if (!patient) {
//       throw new Error('Patient not found');
//     }

//     // Vérification que tous les Caregivers existent
//     const caregiversExist = await Promise.all(
//       caregivers.map(id => Caregiver.findByPk(id))
//     );
//     if (caregiversExist.includes(null)) {
//       throw new Error('One or more caregivers not found');
//     }

//     // Créer le ProgramEnrollement avec transaction
//     const newProgramEnrollement = await ProgramEnrollement.create({
//       enrollementDate,
//       startDate,
//       endDate,
//       programEnrollementCode,
//       ProgramId,
//       PatientId
//     }, { transaction });

//     // Créer les associations Patient_Caregiver avec transaction
//     await Promise.all(caregivers.map(caregiverId => 
//       Patient_Caregiver.create({
//         date: new Date(),
//         ProgramEnrollementId: newProgramEnrollement.id,
//         CaregiverId: caregiverId,
//         PatientId: PatientId
//       }, { transaction })
//     ));

//     // Valider la transaction
//     await transaction.commit();
    
//     res.status(201).json(newProgramEnrollement);
//   } catch (error: any) {
//     // Annuler la transaction en cas d'erreur
//     await transaction.rollback();
    
//     if (!error.statusCode) {
//       error.statusCode = 500;
//     }
//     res.status(error.statusCode).json({ 
//       message: "Error creating program enrollement with caregivers",
//       error: error.message 
//     });
//   }
//   return res;
// };

/**
 * Creates complete enrollment (patient, caregivers, and program enrollment)
 */
// exports.createCompleteEnrollment = async (req: any, res: any, next: any) => {
//   const { patientData, caregivers, enrollmentData } = req.body;
//   const transaction = await sequelize.transaction();

//   try {
//     // 1. Créer le patient
//     const newPatient = await Patient.create(patientData, { transaction });

//     // 2. Créer le program enrollment
//     const programEnrollment = await ProgramEnrollement.create({
//       ...enrollmentData,
//       PatientId: newPatient.id
//     }, { transaction });

//     // 3. Créer et associer les caregivers
//     if (caregivers && caregivers.length > 0) {
//       if (caregivers.length > 2) {
//         throw new Error('Maximum 2 caregivers allowed per patient');
//       }

//       for (const caregiverData of caregivers) {
//         const caregiver = await Caregiver.create(caregiverData, { transaction });
//         await Patient_Caregiver.create({
//           date: new Date(),
//           ProgramEnrollementId: programEnrollment.id,
//           CaregiverId: caregiver.id,
//           PatientId: newPatient.id
//         }, { transaction });
//       }
//     }

//     await transaction.commit();
//     res.status(201).json({
//       patient: newPatient,
//       enrollment: programEnrollment
//     });
//   } catch (error: any) {
//     await transaction.rollback();
//     if (!error.statusCode) {
//       error.statusCode = 500;
//     }
//     res.status(error.statusCode).json({ 
//       message: "Error creating complete enrollment",
//       error: error.message 
//     });
//   }
//   return res;
// };

/**
 * Updates an existing program enrollement.
 */
exports.updateProgramEnrollement = async (req: any, res: any, next: any) => {
  const enrollementId = req.params.id;
  const { enrollementDate, startDate, endDate, programEnrollementCode, ProgramId, PatientId } = req.body;
  try {
    const programEnrollement = await ProgramEnrollement.findByPk(enrollementId);
    if (!programEnrollement) {
      return res.status(404).json({ message: "Program enrollement not found" });
    }
    programEnrollement.enrollementDate = enrollementDate;
    programEnrollement.startDate = startDate;
    programEnrollement.endDate = endDate;
    programEnrollement.programEnrollementCode = programEnrollementCode;
    programEnrollement.ProgramId = ProgramId;
    programEnrollement.PatientId = PatientId;
    await programEnrollement.save();
    res.status(200).json(programEnrollement);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error updating program enrollement" });
  }
  return res;
};

/**
 * Deletes a program enrollement.
 */
exports.deleteProgramEnrollement = async (req: any, res: any, next: any) => {
  const enrollementId = req.params.id;
  try {
    const programEnrollement = await ProgramEnrollement.findByPk(enrollementId);
    if (!programEnrollement) {
      return res.status(404).json({ message: "Program enrollement not found" });
    }
    await programEnrollement.destroy();
    res.status(200).json({ message: "Program enrollement deleted" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error deleting program enrollement" });
  }
  return res;
};

/**
 * Returns a specific program enrollement based on its ID.
 */
exports.getProgramEnrollement = async (req: any, res: any, next: any) => {
  const enrollementId = req.params.id;
  try {
    const programEnrollement = await ProgramEnrollement.findByPk(enrollementId);
    if (!programEnrollement) {
      return res.status(404).json({ message: "Program enrollement not found" });
    }
    res.status(200).json(programEnrollement);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error loading program enrollement from the database" });
  }
  return res;
};

/**
 * Returns all program enrollements.
 */
exports.getProgramEnrollements = async (req: any, res: any, next: any) => {
  try {
    const programEnrollements = await ProgramEnrollement.findAll();
    res.status(200).json(programEnrollements);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error loading program enrollements from the database" });
  }
  return res;
};
