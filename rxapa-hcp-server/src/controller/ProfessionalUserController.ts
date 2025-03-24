import { Professional_User } from "../model/Professional_User";
import { Admin } from "../model/Admin";
import { Doctor } from "../model/Doctor";
import { Kinesiologist } from "../model/Kinesiologist";
import { Follow_Patient } from "../model/Follow_Patient";
import { Patient } from "../model/Patient";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import crypto from "crypto";
import { hash } from "./UserController";
import { generateCode, sendEmail } from "../util/unikpass";

/**
 * Creates a new professional user.
 */
export const createProfessionalUser = async (req: any, res: any, next: any) => {
  const {
    firstname,
    lastname,
    email,
    phoneNumber,
    password,
    role,
    workEnvironment,
  } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await Professional_User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "error_user_exists" });
    }

    // Hacher le mot de passe
    const hashedPassword = await hash(password);

    // Créer l'utilisateur professionnel
    const newProfessionalUser = await Professional_User.create({
      firstname,
      lastname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    // Générer un code unique et le hacher
    const code = generateCode(6); // Générer un code à 6 caractères
    const unikPassHashed = await hash(code); // Hacher le code

    if (role === "admin") {
      await Admin.create({ idAdmin: newProfessionalUser.id });
    } else if (role === "doctor") {
      await Doctor.create({
        idDoctor: newProfessionalUser.id,
        workEnvironment,
        unikPassHashed,
      });
    } else if (role === "kinesiologist") {
      await Kinesiologist.create({
        idKinesiologist: newProfessionalUser.id,
        workEnvironment,
        unikPassHashed,
      });
    }

    if (role === "doctor" || role === "kinesiologist") {
      await sendEmail(email, "Votre code d'accès RXAPA", code);
    }

    res.status(201).json(newProfessionalUser);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error); // Pour une meilleure gestion des erreurs
    res
      .status(error.statusCode)
      .json({ message: error.message || "Backend:error_creating_user" });
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
      return res.status(404).json({ message: "Backend:error_user_not_found" });
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
    res
      .status(error.statusCode)
      .json({ message: "Backend:error_updating_user" });
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
      return res.status(404).json({ message: "Backend:error_user_not_found" });
    }
    await professionalUser.destroy();
    res.status(200).json({ message: "Backend:success_user_deleted" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "Backend:error_deleting_user" });
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
      return res.status(404).json({ message: "Backend:error_user_not_found" });
    }
    res.status(200).json(professionalUser);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "Backend:error_loading_user" });
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
    res
      .status(error.statusCode)
      .json({ message: "Backend:error_loading_users" });
  }
  return res;
};

/**
 * Returns patients assigned to a specific kinesiologist.
 */
exports.getKinesiologistPatients = async (req: any, res: any, next: any) => {
  const kinesiologistId = req.params.id;
  try {
    const followPatients: InstanceType<typeof Follow_Patient>[] =
      await Follow_Patient.findAll({
        where: { KinesiologistId: kinesiologistId },
        include: [
          {
            model: ProgramEnrollement,
            include: [Patient],
          },
        ],
      });
    const patients = followPatients.map(
      (fp: InstanceType<typeof Follow_Patient>) =>
        fp.Program_Enrollement.Patient
    );
    res.status(200).json(patients);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "Backend:error_loading_kinesiologist_patients" });
  }
  return res;
};

/**
 * Returns patients assigned to a specific doctor.
 */
exports.getDoctorPatients = async (req: any, res: any, next: any) => {
  const doctorId = req.params.id;
  try {
    const followPatients: InstanceType<typeof Follow_Patient>[] =
      await Follow_Patient.findAll({
        where: { DoctorId: doctorId },
        include: [
          {
            model: ProgramEnrollement,
            include: [Patient],
          },
        ],
      });
    const patients = followPatients.map(
      (fp: InstanceType<typeof Follow_Patient>) =>
        fp.Program_Enrollement.Patient
    );
    res.status(200).json(patients);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "Backend:error_loading_doctor_patients" });
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
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let password = "";

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
      return password
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("");
    };

    const password = generateSecurePassword();
    res.status(200).json({ password });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "Backend:error_generating_password" });
  }
};
