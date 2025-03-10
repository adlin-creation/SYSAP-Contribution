import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Professional_User } from "../model/Professional_User";

interface AuthRequest extends Request {
  user?: any; // on stockera l'objet user trouvé
  userRole?: string; // on stockera "superadmin" ou "admin"/"doctor"/"kinesiologist"
}

/**
 * Middleware qui vérifie le token JWT et identifie le rôle de l'utilisateur
 */
export default async function isAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // Vérifie la présence du header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentification requise" });
  }

  // Récupère le token après 'Bearer '
  const token = authHeader.split(" ")[1];

  try {
    // Vérifie le token
    const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET_KEY as string);

    // Cherche dans User
    let user = await Professional_User.findOne({ where: { email: decoded.email } });
    if (user) {
      // => c'est un "superadmin" (dans votre logique)
      req.user = user; 
      req.userRole = "superadmin";
      return next();
    }

    // Sinon cherche dans Professional_User
    user = await Professional_User.findOne({ where: { email: decoded.email } });
    if (user) {
      // => admin, doctor ou kinesiologist
      req.user = user;
      req.userRole = user.role;
      return next();
    }

    // Si pas trouvé du tout
    return res.status(401).json({ message: "Utilisateur introuvable" });
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}
