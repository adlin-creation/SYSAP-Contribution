import { Exercise } from "../model/Exercise";
import { ExerciseVersion } from "../model/ExerciseVersion";
import { Variant } from "../model/Variant";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { deleteFile } from "../util/file";

// Utility function to handle errors
const handleError = (res: Response, error: unknown, message: string) => {
  if (error instanceof Error) {
    const statusCode = (error as any).statusCode || 500;
    res.status(statusCode).json({
      message: message || "unexpected_error",
      error: error.message || error,
    });
  } else {
    res.status(500).json({
      message: message || "unexpected_error",
      error: "Erreur inconnue",
    });
  }
};

/**
 * Returns an exercise image.
 */
export const getImage = (req: Request, res: Response) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, "..", "images", imageName);

  if (fs.existsSync(imagePath)) {
    const readImageStream = fs.createReadStream(imagePath);
    readImageStream.pipe(res);
  } else {
    res.status(404).json({ message: "image_not_found" });
  }
};

/**
 * Creates a new Exercise.
 */
export const createExercise = async (req: Request, res: Response) => {
  const { name, description, category, fitnessLevel } = req.body;
  const exerciseImageFile = req.file;

  if (!name || !description || !category || !fitnessLevel) {
    return res.status(400).json({ message: "all_fields_required" });
  }

  const imageUrl = exerciseImageFile?.path ?? "";

  try {
    await Exercise.create({
      name,
      description,
      category,
      fitnessLevel,
      imageUrl,
    });

    res.status(201).json({ message: "exercise_created_successfully" });
  } catch (error: unknown) {
    // Supprimer le fichier uniquement s'il existe
    if (imageUrl && fs.existsSync(imageUrl)) {
      try {
        deleteFile(imageUrl); // Nettoyer uniquement les fichiers locaux
      } catch (fileError) {
        console.error("Erreur lors de la suppression du fichier :", fileError);
      }
    }

    // Gestion des erreurs
    if (error instanceof Error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(409).json({ message: "exercise_already_exists" });
      } else {
        res.status(500).json({
          message: "error_creating_exercise",
          error: error.message,
        });
      }
    } else {
      res.status(500).json({
        message: "unknown_error_creating_exercise",
      });
    }
  }
};

/**
 * Updates an existing Exercise.
 */
export const updateExercise = async (req: Request, res: Response) => {
  const exerciseKey = req.params.exerciseKey;
  const { name, description, category, fitnessLevel } = req.body;

  try {
    const exercise = await Exercise.findOne({ where: { key: exerciseKey } });
    if (!exercise) {
      return res.status(404).json({ message: "exercise_not_found" });
    }

    await exercise.update({
      name: name || exercise.name,
      description: description || exercise.description,
      category: category || exercise.category,
      fitnessLevel: fitnessLevel || exercise.fitnessLevel,
    });

    res.status(200).json({ message: "exercise_updated_successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(409).json({ message: "exercise_already_exists" });
      } else {
        res.status(500).json({
          message: "error_updating_exercise",
          error: error.message,
        });
      }
    } else {
      res.status(500).json({
        message: "unknown_error_updating_exercise.",
      });
    }
  }
};

/**
 * Returns all the exercises.
 */
export const getExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await Exercise.findAll();
    res.status(200).json(exercises);
  } catch (error: unknown) {
    if (error instanceof Error) {
      handleError(res, error, "error_loading_exercises");
    } else {
      handleError(res, error, "unknown_error_loading_exercises");
    }
  }
};

/**
 * Returns a specific exercise based on its key.
 */
export const getExercise = async (req: Request, res: Response) => {
  const exerciseKey = req.params.exerciseKey;
  try {
    const exercise = await Exercise.findOne({
      where: { key: exerciseKey },
      include: ExerciseVersion,
    });
    if (!exercise) {
      return res.status(404).json({ message: "exercise_not_found" });
    }
    res.status(200).json(exercise);
  } catch (error: unknown) {
    if (error instanceof Error) {
      handleError(res, error, "error_loading_exercises");
    } else {
      handleError(res, error, "unknown_error_loading_exercises");
    }
  }
};

/**
 * Creates a new ExerciseVersion.
 */
export const createExerciseVersion = async (req: Request, res: Response) => {
  const { name, numberOfRepitions, instructionalVideo } = req.body;

  if (!name || !numberOfRepitions) {
    return res.status(400).json({ message: "all_fields_required" });
  }

  try {
    await ExerciseVersion.create({
      name,
      numberOfRepitions,
      instructionalVideo,
    });
    res.status(201).json({ message: "exercise_version_created_successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      handleError(res, error, "error_creating_exercise_version");
    } else {
      handleError(res, error, "unknown_error_creating_exercise_version");
    }
  }
};

/**
 * Adds a new exercise version to an existing exercise.
 */
export const addExerciseVersion = async (req: Request, res: Response) => {
  const { exerciseName, versionName, level } = req.body;

  try {
    const exercise = await Exercise.findOne({ where: { name: exerciseName } });
    if (!exercise) {
      return res.status(404).json({ message: "exercise_not_found" });
    }

    const exerciseVersion = await ExerciseVersion.findOne({
      where: { name: versionName },
    });
    if (!exerciseVersion) {
      return res.status(404).json({ message: "exercise_version_not_found" });
    }

    await Variant.create({
      ExerciseVersionId: exerciseVersion.id,
      ExerciseId: exercise.id,
      level,
    });
    res.status(201).json({ message: "exercise_version_added_success" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      handleError(res, error, "error_adding_exercise_version");
    } else {
      handleError(res, error, "unknown_error_adding_exercise_version");
    }
  }
};

/**
 * Deletes an exercise.
 */
export const deleteExercise = async (req: Request, res: Response) => {
  const exerciseKey = req.params.exerciseKey;
  try {
    const exercise = await Exercise.findOne({ where: { key: exerciseKey } });
    if (!exercise) {
      return res.status(404).json({ message: "exercise_not_found" });
    }

    await exercise.destroy();

    // Utilisation de l'optional chaining pour vérifier imageUrl
    if (exercise.imageUrl?.startsWith("/uploads")) {
      deleteFile(exercise.imageUrl); // Nettoyer uniquement les fichiers locaux
    }

    res.status(200).json({ message: "exercise_deleted_successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      handleError(res, error, "error_deleting_exercise");
    } else {
      handleError(res, error, "unknown_error_deleting_exercise");
    }
  }
};
