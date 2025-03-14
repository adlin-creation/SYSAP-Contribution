import { Request, Response, NextFunction } from "express";

export const validateProgram = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, duration, duration_unit, image } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Le nom du programme est requis." });
  }

  if (!description || description.length > 500) {
    return res
      .status(400)
      .json({ message: "La description est trop longue (max 500 caractères)." });
  }

  if (!duration || duration < 1) {
    return res
      .status(400)
      .json({ message: "La durée doit être d'au moins 1 jour ou 1 semaine." });
  }

  if (duration_unit !== "days" && duration_unit !== "weeks") {
    return res
      .status(400)
      .json({ message: "L'unité de durée doit être 'days' ou 'weeks'." });
  }

  if (image && !/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(image)) {
    return res
      .status(400)
      .json({
        message: "L'image doit être une URL valide en .jpg, .png ou .webp.",
      });
  }

  next();
};
