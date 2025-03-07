import { User } from "../model/User"; // Import du modèle User
import { Professional_User } from "../model/Professional_User"; // Import des professionnels
import jwt from "jsonwebtoken"; // Pour générer un token JWT
import { scrypt, randomBytes, timingSafeEqual } from "crypto"; // Pour le hachage des mots de passe
import { promisify } from "util"; // Permet d'utiliser `scrypt` avec `async/await`

const scryptPromise = promisify(scrypt); // Transforme `scrypt` en version asynchrone

/**
 * Inscription d'un nouvel utilisateur.
 * Vérifie l'unicité de l'email, hache le mot de passe et crée un nouvel utilisateur.
 */
export const signup = async (req: any, res: any) => {
  const { name, email, password, confirmPassword, role } = req.body;

  try {
    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }

    // Vérification de la correspondance des mots de passe
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    // Hachage du mot de passe
    const hashedPassword = await hash(password);

    // Création du nouvel utilisateur
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "doctor", // Par défaut, un utilisateur normal est "doctor"
    });

    return res.status(201).json({ message: "Utilisateur créé avec succès." });

  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de l'inscription." });
  }
};

/**
 * Connexion d'un utilisateur.
 * Vérifie les informations de connexion et génère un token JWT.
 */
export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    // Recherche de l'utilisateur dans User OU Professional_User
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

    // Normalisation du rôle
    let finalRole = user.role?.toLowerCase() || "superadmin";

    // Génération du token JWT
    const token = jwt.sign(
      {
        email: user.email,
        key: user.key,
        role: finalRole,
      },
      process.env.TOKEN_SECRET_KEY as string, // Clé secrète stockée dans les variables d’environnement
      { expiresIn: "2h" } // Durée de validité du token
    );

    return res.status(200).json({
      token,
      userId: user.key,
      role: finalRole,
      message: "Connexion réussie.",
    });

  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la connexion." });
  }
};

/**
 * Déconnexion d'un utilisateur (simulée).
 * En réalité, JWT est stocké côté client et n'a pas besoin d'être invalidé côté serveur.
 */
export const logout = async (_req: any, res: any) => {
  return res.status(200).json({ message: "Déconnexion réussie." });
};

/**
 * Hachage d'un mot de passe avec `scrypt` et un sel unique.
 */
export async function hash(password: string) {
  const salt = randomBytes(8).toString("hex"); // Génération d'un sel aléatoire
  const derivedKey = await scryptPromise(password, salt, 64); // Hachage du mot de passe
  return `${salt}:${(derivedKey as Buffer).toString("hex")}`; // Format "sel:hash"
}

/**
 * Vérification d'un mot de passe avec son hash stocké.
 */
export async function verify(password: string, hash: string) {
  const [salt, key] = hash.split(":"); // Extraction du sel et du hash
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = await scryptPromise(password, salt, 64); // Re-hachage
  return timingSafeEqual(keyBuffer, derivedKey as Buffer); // Comparaison sécurisée
}
