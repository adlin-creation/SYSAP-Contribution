import { User } from "../model/User"; // Importation du modèle User pour interagir avec la base de données des utilisateurs
import { Professional_User } from "../model/Professional_User"; // Importation du modèle Professional_User pour gérer les utilisateurs professionnels
import jwt from "jsonwebtoken"; // Importation de jsonwebtoken pour la gestion des tokens JWT

import { scrypt, randomBytes, timingSafeEqual } from "crypto"; // Importation de fonctions pour le hachage des mots de passe
import { promisify } from "util"; // Importation de promisify pour transformer scrypt en version asynchrone

const scryptPromise = promisify(scrypt); // Permet d'utiliser `scrypt` avec `async/await`

/**
 * Fonction d'inscription d'un nouvel utilisateur
 */
exports.signup = async (req: any, res: any) => {
  // Récupération des données envoyées par le frontend
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // Hachage du mot de passe pour la sécurité
  const hashedPassword = await hash(password);
  const isEqualPassword = await verify(confirmPassword, hashedPassword);

  // Vérification si le mot de passe et la confirmation sont identiques
  if (!isEqualPassword) {
    return res.status(500).json({ message: "Please confirm your password" });
  }

  let user;

  try {
    // Vérifier si l'utilisateur existe déjà dans la base de données
    user = await User.findOne({ where: { email: email } });
    if (user) {
      return res
        .status(500)
        .json({ message: "A user with the email already exist" });
    }
  } catch (error) {
    console.log(error);
    return;
  }

  try {
    // Création d'un nouvel utilisateur avec les informations fournies
    user = await User.create({
      name: name,
      email: email,
      password: hashedPassword, // Stockage du mot de passe haché
    });

    return res.status(200).json({ message: "Successfully signed up" }); // Succès de l'inscription
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "Failed to signup the new user" }); // Échec de l'inscription
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
    user = await User.findOne({ where: { email: email } });

    // Si non trouvé dans `User`, chercher dans `Professional_User`
    if (!user) {
      user = await Professional_User.findOne({ where: { email: email } });
    }

    // Si toujours non trouvé, renvoyer une erreur
    if (!user) {
      return res.status(401).json({ message: "The user doesn't exist" });
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 401;
    }
    return res
      .status(error.statusCode)
      .json({ message: "Failed to authenticate the user" }); // Erreur de connexion
  }

  // Vérification du mot de passe
  const hashedPassword = user.password;
  const isEqualPassword = await verify(password, hashedPassword);

  if (!isEqualPassword) {
    return res
      .status(401)
      .json({ message: "Please enter the correct email and password" }); // Mot de passe incorrect
  }

  // Génération du token JWT
  let token = jwt.sign(
    {
      email: user.email, // Ajout de l'email au token
      key: user.key, // Ajout de l'ID utilisateur au token
      role: user.role || "user", // Ajout du rôle au token (par défaut "user")
    },
    `${process.env.TOKEN_SECRET_KEY}`, // Utilisation d'une clé secrète stockée dans les variables d'environnement
    { expiresIn: "2h" } // Expiration du token en 2 heures
  );

  return res.status(200).json({
    token: token, // Envoi du token au frontend
    userId: user.key, // Envoi de l'ID utilisateur
    role: user.role || "user", // Envoi du rôle utilisateur
    message: "Successfully logged in",
  });
};

/**
 * Fonction de déconnexion (pas réellement nécessaire avec JWT)
 */
exports.logout = (req: any, res: any) => {
  // Les tokens JWT sont basés sur l'expiration, donc on ne stocke rien côté serveur.
  // La déconnexion se fait en supprimant le token côté client.
  return res.status(200).json({
    message: "Successfully logged out",
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