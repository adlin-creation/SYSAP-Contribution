import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../model/User";
import { Professional_User } from "../model/Professional_User";

// Interface pour qu'on puisse stocker "user" dans req
interface AuthRequest extends Request {
  user?: any;
}


export default function isAuth(allowedRoles: string[] = []) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Vérifier l'entête "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    // Extraire le token
    const token = authHeader.split(" ")[1];

    try {
      // Vérifier la validité du token
      const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET_KEY as string);

      // Chercher l'utilisateur dans la DB (User ou Professional_User)
      let user = await User.findOne({ where: { email: decoded.email } });
      if (!user) {
        user = await Professional_User.findOne({ where: { email: decoded.email } });
      }
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      // Vérifier le rôle si on a un tableau de rôles autorisés
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Accès interdit" });
      }

      // Stocker l'utilisateur dans la requête pour l'étape suivante
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }
  };
}
