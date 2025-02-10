import { Professional_User } from "../model/Professional_User";
import { Admin } from "../model/Admin";
import { Doctor } from "../model/Doctor";
import { Kinesiologist } from "../model/Kinesiologist";
import { Follow_Patient } from "../model/Follow_Patient";
import { Patient } from "../model/Patient";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import crypto from 'crypto';

/**
 * Creates a new professional user.
 */
exports.createProfessionalUser = async (req: any, res: any, next: any) => {
  const { firstname, lastname, email, phoneNumber, password, role } = req.body;
  try {
    const newProfessionalUser = await Professional_User.create({
      firstname,
      lastname,
      email,
      phoneNumber,
      password,
      role
    });

    // Create the specific role entity
    if (role === 'admin') {
      await Admin.create({ idAdmin: newProfessionalUser.id });
    } else if (role === 'doctor') {
      await Doctor.create({ idDoctor: newProfessionalUser.id });
    } else if (role === 'kinesiologist') {
      await Kinesiologist.create({ idKinesiologist: newProfessionalUser.id });
    }

    res.status(201).json(newProfessionalUser);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error); // Pour une meilleure gestion des erreurs
    res.status(error.statusCode).json({ message: error.message || "Error creating professional user" });
  }
  return res;
};

/**
 * Updates an existing professional user.
 */
exports.updateProfessionalUser = async (req: any, res: any, next: any) => {
  const userId = req.params.id;
  const { firstname, lastname, email, phoneNumber, role, active } = req.body;
  try {
    const professionalUser = await Professional_User.findByPk(userId);
    if (!professionalUser) {
      return res.status(404).json({ message: "Professional user not found" });
    }
    professionalUser.firstname = firstname;
    professionalUser.lastname = lastname;
    professionalUser.email = email;
    professionalUser.phoneNumber = phoneNumber;
    professionalUser.role = role;
    professionalUser.active = active;
    await professionalUser.save();
    res.status(200).json(professionalUser);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error updating professional user" });
  }
  return res;
};

/**
 * Deletes a professional user.
 */
exports.deleteProfessionalUser = async (req: any, res: any, next: any) => {
  const userId = req.params.id;
  try {
    const professionalUser = await Professional_User.findByPk(userId);
    if (!professionalUser) {
      return res.status(404).json({ message: "Professional user not found" });
    }
    await professionalUser.destroy();
    res.status(200).json({ message: "Professional user deleted" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error deleting professional user" });
  }
  return res;
};

/**
 * Returns a specific professional user based on their ID.
 */
exports.getProfessionalUser = async (req: any, res: any, next: any) => {
  const userId = req.params.id;
  try {
    const professionalUser = await Professional_User.findByPk(userId);
    if (!professionalUser) {
      return res.status(404).json({ message: "Professional user not found" });
    }
    res.status(200).json(professionalUser);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error loading professional user from the database" });
  }
  return res;
};

/**
 * Returns all professional users.
 */
exports.getProfessionalUsers = async (req: any, res: any, next: any) => {
  try {
    const professionalUsers = await Professional_User.findAll();
    res.status(200).json(professionalUsers);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error loading professional users from the database" });
  }
  return res;
};

/**
 * Returns patients assigned to a specific kinesiologist.
 */
exports.getKinesiologistPatients = async (req: any, res: any, next: any) => {
  const kinesiologistId = req.params.id;
  try {
    const followPatients: InstanceType<typeof Follow_Patient>[] = await Follow_Patient.findAll({
      where: { KinesiologistId: kinesiologistId },
      include: [{
        model: ProgramEnrollement,
        include: [Patient]
      }]
    });
    const patients = followPatients.map((fp: InstanceType<typeof Follow_Patient>) => fp.Program_Enrollement.Patient);
    res.status(200).json(patients);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error loading patients for kinesiologist" });
  }
  return res;
};

/**
 * Returns patients assigned to a specific doctor.
 */
exports.getDoctorPatients = async (req: any, res: any, next: any) => {
  const doctorId = req.params.id;
  try {
    const followPatients: InstanceType<typeof Follow_Patient>[] = await Follow_Patient.findAll({
      where: { DoctorId: doctorId },
      include: [{
        model: ProgramEnrollement,
        include: [Patient]
      }]
    });
    const patients = followPatients.map((fp: InstanceType<typeof Follow_Patient>) => fp.Program_Enrollement.Patient);
    res.status(200).json(patients);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error loading patients for doctor" });
  }
  return res;
};

/**
 * Generates a secure password based on user information
 */
exports.generatePassword = async (req: any, res: any, next: any) => {
  try {
    // Génère une chaîne aléatoire de 12 caractères
    const generateSecurePassword = () => {
      const length = 12;
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let password = '';
      
      // Assure au moins un chiffre et une lettre
      password += charset.slice(52)[Math.floor(Math.random() * 10)]; // un chiffre
      password += charset.slice(0, 52)[Math.floor(Math.random() * 52)]; // une lettre
      
      // Complète avec des caractères aléatoires
      for (let i = 2; i < length; i++) {
        const randomBytes = crypto.randomBytes(1);
        const randomIndex = randomBytes[0] % charset.length;
        password += charset[randomIndex];
      }
      
      // Mélange le mot de passe final
      return password.split('').sort(() => 0.5 - Math.random()).join('');
    };

    const password = generateSecurePassword();
    res.status(200).json({ password });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ message: "Error generating password" });
  }
};
