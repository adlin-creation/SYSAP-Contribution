import { Request, Response, NextFunction } from "express";
import { Professional_User } from "../model/Professional_User";
import { Op } from "sequelize";

export const validateResetToken = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token requis." });
  }

  try {
    const user = await Professional_User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide ou expiré." });
    }

    // On attache l'utilisateur trouvé à la requête pour l'utiliser dans le contrôleur
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Erreur lors de la validation du token." });
  }
};