import { Exercise } from "../model/Exercise";
import { ExerciseVersion } from "../model/ExerciseVersion";
import { Variant } from "../model/Variant";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";
const fileHelper = require("./../util/file");

// Utility function to handle errors
const handleError = (res: Response, error: unknown, message: string) => {
  if (error instanceof Error) {
    const statusCode = (error as any).statusCode || 500;
    res.status(statusCode).json({
      message: message || "Une erreur est survenue",
      error: error.message || error,
    });
  } else {
    // Si l'erreur n'est pas une instance d'Error, on renvoie un message générique
    res.status(500).json({
      message: message || "Une erreur est survenue",
      error: "Erreur inconnue",
    });
  }
};

/**
 * Returns an exercise image.
 */
exports.getImage = (req: Request, res: Response) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, "..", "images", imageName);

  if (fs.existsSync(imagePath)) {
    const readImageStream = fs.createReadStream(imagePath);
    readImageStream.pipe(res);
  } else {
    res.status(404).json({ message: "Image non trouvée" });
  }
};

/**
 * Creates a new Exercise.
 */
exports.createExercise = async (req: Request, res: Response) => {
  const { name, description, instructionalVideo, category, isSeating, targetAgeRange, fitnessLevel } = req.body;
  const exerciseImageFile = req.file;

  if (!name || !description || !instructionalVideo) {
    return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis !" });
  }

  const imageUrl = exerciseImageFile?.path ?? "";

  try {
    await Exercise.create({
      name,
      description,
      instructionalVideo,
      category,
      isSeating,
      targetAgeRange,
      fitnessLevel,
      imageUrl,
    });

    res.status(201).json({ message: "Exercice créé avec succès." });
  } catch (error: unknown) {
    if (imageUrl) {
      fileHelper.deleteFile(imageUrl); // Cleanup if error occurs
    }

    if (error instanceof Error) {
      // Vérifier si l'erreur est spécifique à la contrainte d'unicité
      if (error.name === "SequelizeUniqueConstraintError") {
        handleError(res, error, "Un exercice avec ce nom existe déjà !");
      } else {
        handleError(res, error, "Erreur lors de la création de l'exercice.");
      }
    } else {
      // Si l'erreur n'est pas une instance d'Error, renvoyer une erreur générique
      handleError(res, error, "Erreur inconnue lors de la création de l'exercice.");
    }
  }
};

/**
 * Updates an existing Exercise.
 */
exports.updateExercise = async (req: Request, res: Response) => {
  const exerciseKey = req.params.exerciseKey;
  const { name, description, instructionalVideo, category, isSeating, targetAgeRange, fitnessLevel } = req.body;

  try {
    const exercise = await Exercise.findOne({ where: { key: exerciseKey } });
    if (!exercise) {
      return res.status(404).json({ message: "Exercice non trouvé !" });
    }

    await exercise.update({
      name: name || exercise.name,
      description: description || exercise.description,
      instructionalVideo: instructionalVideo || exercise.instructionalVideo,
      category: category || exercise.category,
      isSeating: isSeating || exercise.isSeating,
      targetAgeRange: targetAgeRange || exercise.targetAgeRange,
      fitnessLevel: fitnessLevel || exercise.fitnessLevel,
    });

    res.status(200).json({ message: "Exercice mis à jour avec succès." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      handleError(res, error, "Erreur lors de la mise à jour de l'exercice.");
    } else {
      handleError(res, error, "Erreur inconnue lors de la mise à jour de l'exercice.");
    }
  }
};

/**
 * Returns all the exercises.
 */
exports.getExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await Exercise.findAll();
    res.status(200).json(exercises);
  } catch (error: unknown) {
    if (error instanceof Error) {
      handleError(res, error, "Erreur lors du chargement des exercices.");
    } else {
      handleError(res, error, "Erreur inconnue lors du chargement des exercices.");
    }
  }
};

/**
 * Returns a specific exercise based on its key.
 */
exports.getExercise = async (req: Request, res: Response) => {
  const exerciseKey = req.params.exerciseKey;
  try {
    const exercise = await Exercise.findOne({ where: { key: exerciseKey }, include: ExerciseVersion });
    if (!exercise) {
      return res.status(404).json({ message: "Exercice non trouvé !" });
    }
    res.status(200).json(exercise);
  } catch (error: unknown) {
    if (error instanceof Error) {
      handleError(res, error, "Erreur lors du chargement de l'exercice.");
    } else {
      handleError(res, error, "Erreur inconnue lors du chargement de l'exercice.");
    }
  }
};

/**
 * Creates a new ExerciseVersion.
 */
exports.createExerciseVersion = async (req: Request, res: Response) => {
  const { name, numberOfRepitions, instructionalVideo } = req.body;

  if (!name || !numberOfRepitions) {
    return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis !" });
  }

  try {
    await ExerciseVersion.create({ name, numberOfRepitions, instructionalVideo });
    res.status(201).json({ message: "Version d'exercice créée avec succès." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      handleError(res, error, "Erreur lors de la création de la version d'exercice.");
    } else {
      handleError(res, error, "Erreur inconnue lors de la création de la version d'exercice.");
    }
  }
};

/**
 * Adds a new exercise version to an existing exercise.
 */
exports.addExerciseVersion = async (req: Request, res: Response) => {
  const { exerciseName, versionName, level } = req.body;

  try {
    const exercise = await Exercise.findOne({ where: { name: exerciseName } });
    if (!exercise) {
      return res.status(404).json({ message: "Exercice non trouvé !" });
    }

    const exerciseVersion = await ExerciseVersion.findOne({ where: { name: versionName } });
    if (!exerciseVersion) {
      return res.status(404).json({ message: "Version d'exercice non trouvée !" });
    }

    await Variant.create({ ExerciseVersionId: exerciseVersion.id, ExerciseId: exercise.id, level });
    res.status(201).json({ message: "Version d'exercice ajoutée avec succès." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      handleError(res, error, "Erreur lors de l'ajout de la version à l'exercice.");
    } else {
      handleError(res, error, "Erreur inconnue lors de l'ajout de la version à l'exercice.");
    }
  }
};

/**
 * Deletes an exercise.
 */
exports.deleteExercise = async (req: Request, res: Response) => {
  const exerciseKey = req.params.exerciseKey;
  try {
    const exercise = await Exercise.findOne({ where: { key: exerciseKey } });
    if (!exercise) {
      return res.status(404).json({ message: "Exercice non trouvé !" });
    }

    await exercise.destroy();
    if (exercise.imageUrl) {
      fileHelper.deleteFile(exercise.imageUrl); // Cleanup image if exists
    }

    res.status(200).json({ message: "Exercice supprimé avec succès." });
  } catch (error: unknown) {
    if (error instanceof Error) {
      handleError(res, error, "Erreur lors de la suppression de l'exercice.");
    } else {
      handleError(res, error, "Erreur inconnue lors de la suppression de l'exercice.");
    }
  }
};
