import { Professional_User } from "../model/Professional_User";
import { Admin } from "../model/Admin";
import { Doctor } from "../model/Doctor";
import { Kinesiologist } from "../model/Kinesiologist";
import { Follow_Patient } from "../model/Follow_Patient";
import { Patient } from "../model/Patient";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import crypto from 'crypto';
import bcrypt from "bcrypt";
import { hash } from './UserController';
import { hashValue, verifyHash } from "../util/unikpass";

import { generateCode, sendEmail } from "../util/unikpass";

console.log("generateCode:", generateCode);

/**
 * Creates a new professional user.
 */
export const createProfessionalUser = async (req: any, res: any, next: any) => {
  const { firstname, lastname, email, phoneNumber, password, role, workEnvironment } = req.body;

  try {
    // 🔹 Vérifier si l'utilisateur existe déjà
    const existingUser = await Professional_User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "existing professional user with this email" });
    }

    // 🔹 Générer un code d’accès temporaire (6 caractères)
    const code = generateCode(6); // Générer un code à 6 caractères
    console.log("Code généré :", code); // Vérifier si le code est bien généré

    // 🔹 Hacher le code d’accès temporaire
    const unikPassHashed = await bcrypt.hash(code, 10); // Hash avec bcrypt 

    // 🔹 Créer l'utilisateur professionnel avec `active: false`
    const newProfessionalUser = await Professional_User.create({
      firstname,
      lastname,
      email,
      phoneNumber,
      password: unikPassHashed, // Stocke le code d’accès temporaire dans password
      role,
      active: false, // L'utilisateur est inactif par défaut
    });

    // 🔹 Ajouter les informations spécifiques en fonction du rôle
    if (role === 'admin') {
      await Admin.create({ idAdmin: newProfessionalUser.id });

    } else if (role === 'doctor') {
      await Doctor.create({
        idDoctor: newProfessionalUser.id,
        workEnvironment,
        unikPassHashed, // Stocke aussi le code temporaire ici
      });

    } else if (role === 'kinesiologist') {
      await Kinesiologist.create({
        idKinesiologist: newProfessionalUser.id,
        workEnvironment,
        unikPassHashed, // Stocke aussi le code temporaire ici
      });
    }

    // 🔹 Envoyer le code d’accès par email aux `doctor` et `kinesiologist`
    if (role === 'doctor' || role === 'kinesiologist') {
      await sendEmail(
        email,
        "Votre code d'accès RXAPA",
        `Bonjour ${firstname},\n\nVotre code d'accès temporaire est : ${code}\n\nVeuillez l'utiliser pour définir votre mot de passe sur notre plateforme.\n`
      );
    }

    return res.status(201).json({ message: "Utilisateur créé avec succès, en attente d'activation." });

  } catch (error: any) {
    console.error("Erreur lors de la création de l'utilisateur :", error);

    if (!error.statusCode) {
      error.statusCode = 500;
    }

    return res.status(error.statusCode).json({ message: "Error creating professional user" });
  }
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

