// Gère l'authentification des utilisateurs (inscription, connexion, déconnexion)
import { User } from "../model/User"; // Import du modèle User
import { Professional_User } from "../model/Professional_User"; // Import des professionnels
import jwt from "jsonwebtoken"; // Pour générer un token JWT
import { scrypt, randomBytes, timingSafeEqual } from "crypto"; // Hachage des mots de passe
import { promisify } from "util"; // Permet d'utiliser scrypt avec async/await

const scryptPromise = promisify(scrypt); // Transforme scrypt en fonction asynchrone

/**
 * Inscription d'un nouvel utilisateur
 */
export const signup = async (req: any, res: any) => {
  const { name, email, password, confirmPassword } = req.body;

  // Hachage du mot de passe
  const hashedPassword = await hash(password);
  const isEqualPassword = await verify(confirmPassword, hashedPassword);

  if (!isEqualPassword) {
    return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
  }

  try {
    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }

    // Création du nouvel utilisateur
    await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({ message: "Utilisateur créé avec succès." });

  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de l'inscription." });
  }
};

/**
 * Connexion d'un utilisateur
 */
export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    // Recherche de l'utilisateur dans User et Professional_User
    let user =
      (await User.findOne({ where: { email } })) ||
      (await Professional_User.findOne({ where: { email } }));

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    // Vérification du mot de passe
    const isEqualPassword = await verify(password, user.password);
    if (!isEqualPassword) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    // Préparation du rôle renvoyé (pour s'assurer qu'on utilise 'superadmin' en minuscules)
    let finalRole: string;
    if (!user.role) {
      // Si le user n'a pas de rôle => on force superadmin
      finalRole = "superadmin";
    } else {
      // Sinon on met tout en minuscules pour uniformiser
      finalRole = user.role.toLowerCase();
    }

    // Génération du token JWT
    const token = jwt.sign(
      {
        email: user.email,
        key: user.key,
        role: finalRole, // On stocke la version unifiée du rôle
      },
      process.env.TOKEN_SECRET_KEY as string,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      token,
      userId: user.key,
      // On renvoie le rôle unifié
      role: finalRole,
      message: "Connexion réussie.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la connexion." });
  }
};

/**
 * Déconnexion d'un utilisateur (nécessite un token JWT)
 */
export const logout = async (_req: any, res: any) => {
  return res.status(200).json({ message: "Déconnexion réussie." });
};

/**
 * Hachage du mot de passe
 */
export async function hash(password: string) {
  const salt = randomBytes(8).toString("hex");
  const derivedKey = await scryptPromise(password, salt, 64);
  return `${salt}:${(derivedKey as Buffer).toString("hex")}`;
}

/**
 * Vérification d'un mot de passe avec son hash
 */
export async function verify(password: string, hash: string) {
  const [salt, key] = hash.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = await scryptPromise(password, salt, 64);
  return timingSafeEqual(keyBuffer, derivedKey as Buffer);
}
