import { User } from "../model/User";
import { Professional_User } from "../model/Professional_User";
import jwt from "jsonwebtoken";

import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptPromise = promisify(scrypt);

/**
 * Signup function
 */
exports.signup = async (req: any, res: any) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const hashedPassword = await hash(password);
  const isEqualPassword = await verify(confirmPassword, hashedPassword);

  if (!isEqualPassword) {
    return res.status(500).json({ message: "Please confirm your password" });
  }

  let user;

  try {
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
    user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    return res.status(200).json({ message: "Successfully signed up" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "Failed to signup the new user" });
  }
};

/**
 * login function
 */
exports.login = async (req: any, res: any) => {
  const email = req.body.email;
  const password = req.body.password;

  let user;

  try {
    user = await User.findOne({ where: { email: email } });
    // Si non trouvé dans User, chercher dans ProfessionalUser
    if (!user) {
      user = await Professional_User.findOne({ where: { email: email } });
    }
    if (!user) {
      return res.status(401).json({ message: "The user doesn't exist" });
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 401;
    }
    return res
      .status(error.statusCode)
      .json({ message: "Failed to authenticate the user" });
  }

  const hashedPassword = user.password;
  const isEqualPassword = await verify(password, hashedPassword);

  if (!isEqualPassword) {
    return res
      .status(401)
      .json({ message: "Please enter the correct email and password" });
  }

  // Récupérer le rôle de l'utilisateur (par exemple 'user', 'admin', etc.)
  //const role = user.role || "admin"; // Utiliser "admin" comme valeur par défaut si 'role' n'existe pas

  let token = "true";

  token = jwt.sign(
    {
      email: user.email,
      key: user.key,
      role: user.role || "user",  // Inclure le rôle dans le token
    },
    `${process.env.TOKEN_SECRET_KEY}`,
    { expiresIn: "2h" }
  );

  return res.status(200).json({
    token: token,
    userId: user.key,
    role: user.role || "user",
    message: "Successfully logged in",
  });
};

/**
 * Logout function
 */
exports.logout = (req: any, res: any) => {
  // Si vous utilisez des sessions ou des tokens JWT avec une durée d'expiration, vous pouvez simplement invalider le token côté client.
  return res.status(200).json({
    message: "Successfully logged out",
  });
};

async function hash(password: string) {
  const salt = randomBytes(8).toString("hex");
  const derivedKey = await scryptPromise(password, salt, 64);
  return salt + ":" + (derivedKey as Buffer).toString("hex");
}

async function verify(password: string, hash: string) {
  const [salt, key] = hash.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = await scryptPromise(password, salt, 64);
  return timingSafeEqual(keyBuffer, derivedKey as Buffer);
}
