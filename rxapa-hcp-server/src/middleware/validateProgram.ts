import { Request, Response, NextFunction } from "express";

export const validateProgram = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, duration, duration_unit, image } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "error_program_name_required" });
  }

  if (!description || description.length > 500) {
    return res.status(400).json({
      message: "error_description_too_long",
    });
  }

  if (!duration || duration < 1) {
    return res.status(400).json({ message: "error_duration_minimum" });
  }

  if (duration_unit !== "days" && duration_unit !== "weeks") {
    return res.status(400).json({ message: "error_duration_unit" });
  }

  if (image && !/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(image)) {
    return res.status(400).json({
      message: "error_invalid_image_url",
    });
  }

  next();
};
