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


