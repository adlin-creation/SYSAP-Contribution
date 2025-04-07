import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Professional_User } from "../model/Professional_User";

interface AuthRequest extends Request {
  user?: any; // on y stocke l'objet user trouvé en base
  userRole?: string; // on y stocke le rôle (admin, doctor, kinesiologist, superadmin)
}

/**
 
Middleware qui vérifie le token JWT et identifie le rôle de l'utilisateur*/
export default async function isAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // Vérifie la présence du header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "error_authentification_required" });
  }

  // Récupère le token après 'Bearer '
  const token = authHeader.split(" ")[1];

  try {
    // Vérifie le token
    const decoded: any = jwt.verify(
      token,
      process.env.TOKEN_SECRET_KEY as string
    );

    // Cherche l'utilisateur dans Professional_User (quel que soit le rôle)
    const user = await Professional_User.findOne({
      where: { email: decoded.email },
    });

    if (!user) {
      // Si on ne trouve personne
      return res.status(401).json({ message: "error_user_not_found" });
    }

    // On assigne l'utilisateur et son rôle
    req.user = user;
    req.userRole = user.role; // => 'admin', 'doctor', 'kinesiologist', 'superadmin', etc.

    return next();
  } catch (error) {
    return res.status(401).json({ message: "error_invalid_token" });
  }
}
