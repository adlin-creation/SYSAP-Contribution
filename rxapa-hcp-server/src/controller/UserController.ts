<<<<<<< HEAD
import { Professional_User } from "../model/Professional_User"; // Gestion des utilisateurs professionnels
import jwt from "jsonwebtoken"; // Pour le token JWT
import bcrypt from "bcrypt"; // Pour hasher les mots de passe
import { v4 as uuidv4 } from "uuid"; // Pour générer un token de réinitialisation
import { sendResetEmail } from "../util/email"; // Pour envoyer l'email
import { Op } from "sequelize"; // Pour les requêtes avancées

/**
 * Fonction d'inscription d'un nouvel utilisateur
 */
exports.signup = async (req: any, res: any) => {
  const { firstname, lastname, email, role, password, confirmPassword, phoneNumber } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "confirm_password" });
  }

  const hashedPassword = await hash(password);

  try {
    const existingUser = await Professional_User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "user_email_exist" });
    }

    const user = await Professional_User.create({
      firstname,
      lastname,
      email,
      role,
      phoneNumber,
      password: hashedPassword,
    });

    return res.status(200).json({ message: "sign_up_success" });
  } catch (error: any) {
    return res.status(500).json({ message: "failed_sign_up" });
  }
};

/**
 * Fonction de connexion
 */
exports.login = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const user = await Professional_User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "user_non_existant" });
    }

    const isEqualPassword = await verify(password, user.password);

    if (!isEqualPassword) {
      return res.status(401).json({ message: "input_correct_email_password" });
    }

    const token = jwt.sign(
      {
        email: user.email,
        key: user.key,
        role: user.role,
      },
      `${process.env.TOKEN_SECRET_KEY}`,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      token,
      userId: user.key,
      role: user.role,
      message: "success_login",
    });
  } catch (error: any) {
    return res.status(500).json({ message: "failed_authenticate_user" });
  }
};

/**
 * Déconnexion (token JWT = stateless, donc rien à faire côté serveur)
 */
exports.logout = (req: any, res: any) => {
  return res.status(200).json({ message: "success_logout" });
};

/**
 * Fonction de hachage du mot de passe avec bcrypt
 */
export async function hash(password: string) {
  return await bcrypt.hash(password, 10);
}

/**
 * Fonction de vérification du mot de passe haché
 */
export async function verify(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Demande de réinitialisation de mot de passe
 */
exports.resetPasswordRequest = async (req: any, res: any) => {
  const { email } = req.body;

  const user = await Professional_User.findOne({ where: { email } });

  const token = uuidv4();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  if (user) {
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const link = `http://localhost:3000/reset-password?token=${token}`;
    await sendResetEmail(user.email, link);
  }

  return res.status(200).json({
    message: "success_sending_link.",
  });
};

/**
 * Réinitialisation du mot de passe
 */
exports.resetPassword = async (req: any, res: any) => {
  const { token, new_password } = req.body;

  if (!token || !new_password) {
    return res.status(400).json({ message: "token_or_password_missing" });
  }

  const user = await Professional_User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        [Op.gt]: new Date(),
      },
    },
  });

  if (!user) {
    return res.status(400).json({ message: "invalid_or_expired_token" });
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);

  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  return res.status(200).json({ message: "success_password_reset" });
};
exports.resetPasswordRequest = async (req: any, res: any) => {
  const email = req.body.email;

  const user = await Professional_User.findOne({ where: { email } });

  const token = uuidv4();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  if (user) {
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();
    

    const link = `http://localhost:3000/reset-password?token=${token}`;
    console.log("🟡 Envoi du lien à :", user.email);
    console.log("🔗 Lien :", link);
    await sendResetEmail(user.email, link);
  }

  return res.status(200).json({
    message: "success_sending_link",
  });
};


=======
import { Professional_User } from "../model/Professional_User"; // Importation du modèle Professional_User pour gérer les utilisateurs professionnels
import jwt from "jsonwebtoken"; // Importation de jsonwebtoken pour la gestion des tokens JWT

import { scrypt, randomBytes, timingSafeEqual } from "crypto"; // Importation de fonctions pour le hachage des mots de passe
import { promisify } from "util"; // Importation de promisify pour transformer scrypt en version asynchrone

import { v4 as uuidv4 } from "uuid";
import { sendResetEmail } from "../util/email";
import { Op } from "sequelize";

const scryptPromise = promisify(scrypt); // Permet d'utiliser `scrypt` avec `async/await`

/**
 * Fonction d'inscription d'un nouvel utilisateur
 */
exports.signup = async (req: any, res: any) => {
  // Récupération des données envoyées par le frontend
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const role = req.body.role;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const phoneNumber = req.body.phoneNumber;

  // Hachage du mot de passe pour la sécurité
  const hashedPassword = await hash(password);
  const isEqualPassword = await verify(confirmPassword, hashedPassword);

  // Vérification si le mot de passe et la confirmation sont identiques
  if (!isEqualPassword) {
    return res.status(500).json({ message: "confirm_password" });
  }

  let user;

  try {
    // Vérifier si l'utilisateur existe déjà dans la base de données
    user = await Professional_User.findOne({ where: { email: email } });
    if (user) {
      return res.status(500).json({ message: "user_email_exist" });
    }
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    // Création d'un nouvel utilisateur avec les informations fournies
    user = await Professional_User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      role: role,
      phoneNumber: phoneNumber, // Ajout de phoneNumber
      password: hashedPassword, // Stockage du mot de passe haché
    });

    return res.status(200).json({ message: "sign_up_success" }); // Succès de l'inscription
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res.status(error.statusCode).json({ message: "failed_sign_up" }); // Échec de l'inscription
  }
};

/**
 * Fonction de connexion d'un utilisateur existant
 */
exports.login = async (req: any, res: any) => {
  // Récupération des identifiants envoyés par le frontend
  const email = req.body.email;
  const password = req.body.password;

  let user;

  try {
    // Vérifier si l'utilisateur existe dans la table `User`

    // Si l'utilisateur n'est pas trouvé, vérifier dans ProfessionalUser

    user = await Professional_User.findOne({ where: { email: email } });

    // Si toujours non trouvé, renvoyer une erreur
    if (!user) {
      return res.status(401).json({ message: "user_non_existant" });
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 401;
    }

    return res
      .status(error.statusCode)
      .json({ message: "failed_authenticate_user" }); // Erreur de connexion
  }

  // Vérification du mot de passe
  const hashedPassword = user.password;
  const isEqualPassword = await verify(password, hashedPassword);

  if (!isEqualPassword) {
    return res.status(401).json({ message: "input_correct_email_password" }); // Mot de passe incorrect
  }

  // Génération du token JWT
  let token = jwt.sign(
    {
      email: user.email, // Ajout de l'email au token
      key: user.key, // Ajout de l'ID utilisateur au token
      role: user.role, // Ajouter le rôle si disponible --- role: user.role
    },
    `${process.env.TOKEN_SECRET_KEY}`, // Utilisation d'une clé secrète stockée dans les variables d'environnement
    { expiresIn: "2h" } // Expiration du token en 2 heures
  );

  return res.status(200).json({
    token: token, // Envoi du token au frontend
    userId: user.key, // Envoi de l'ID utilisateur
    role: user.role, // role: user.role, // Envoi du rôle utilisateur
    message: "success_login",
  });
};

/**
 * Fonction de déconnexion (pas réellement nécessaire avec JWT)
 */
exports.logout = (req: any, res: any) => {
  // Les tokens JWT sont basés sur l'expiration, donc on ne stocke rien côté serveur.
  // La déconnexion se fait en supprimant le token côté client.
  return res.status(200).json({
    message: "sucesss_logout",
  });
};

/**
 * Fonction de hachage du mot de passe avec `scrypt`
 */
export async function hash(password: string) {
  const salt = randomBytes(8).toString("hex"); // Génération d'un sel unique
  const derivedKey = await scryptPromise(password, salt, 64); // Hachage du mot de passe
  return salt + ":" + (derivedKey as Buffer).toString("hex"); // Retourne le mot de passe haché sous format `salt:hash`
}

/**
 * Fonction de vérification du mot de passe haché
 */
export async function verify(password: string, hash: string) {
  const [salt, key] = hash.split(":"); // Séparation du sel et du hash
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = await scryptPromise(password, salt, 64); // Hachage du mot de passe entré
  return timingSafeEqual(keyBuffer, derivedKey as Buffer); // Comparaison sécurisée des h
}

exports.resetPasswordRequest = async (req: any, res: any) => {
  const email = req.body.email;

  const user = await Professional_User.findOne({ where: { email } });

  const token = uuidv4();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  console.log("Requête de réinitialisation reçue pour :", email);

  if (user) {
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const link = `${"http://localhost:3000/reset-password"}?token=${token}`;
    await sendResetEmail(user.email, link);
  }

  // Toujours succès pour ne pas révéler l'existence ou non de l'utilisateur
  return res.status(200).json({
    message: "success_sending_link.",
  });
};

exports.resetPassword = async (req: any, res: any) => {
  const { new_password } = req.body;
  const user = req.user; // récupéré depuis le middleware

  const hashedPassword = await hash(new_password);

  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  return res.status(200).json({ message: "success_password_reset" });
};
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
