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
      message: message || "Une erreur est survenue",
      error: error.message || error,
    });
  } else {
    res.status(500).json({
      message: message || "Une erreur est survenue",
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
    res.status(404).json({ message: "Image non trouvée" });
  }
};

/**
 * Creates a new Exercise.
 */
export const createExercise = async (req: Request, res: Response) => {
  const { name, description, category, fitnessLevel, videoUrl } = req.body;
  const exerciseImageFile = req.file;

  if (!name || !category || !fitnessLevel) {
    return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis !" });
  }

  const imageUrl = exerciseImageFile?.path ?? "";

  try {
    await Exercise.create({
      name,
      description,
      category,
      fitnessLevel,
      videoUrl,
      imageUrl,
    });

    res.status(201).json({ message: "Exercice créé avec succès." });
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
        res.status(409).json({ message: "Un exercice avec ce nom existe déjà !" });
      } else {
        res.status(500).json({ message: "Erreur lors de la création de l'exercice.", error: error.message });
      }
    } else {
      res.status(500).json({ message: "Erreur inconnue lors de la création de l'exercice." });
    }
  }
};

/**
 * Updates an existing Exercise.
 */
export const updateExercise = async (req: Request, res: Response) => {
  const exerciseKey = req.params.exerciseKey;
  const { name, description, category, fitnessLevel, videoUrl } = req.body;

  try {
    const exercise = await Exercise.findOne({ where: { key: exerciseKey } });
    if (!exercise) {
      return res.status(404).json({ message: "Exercice non trouvé !" });
    }

    await exercise.update({
      name: name || exercise.name,
      description: description || exercise.description,
      category: category || exercise.category,
      fitnessLevel: fitnessLevel || exercise.fitnessLevel,
      videoUrl: videoUrl || exercise.videoUrl,
    });

    res.status(200).json({ message: "Exercice mis à jour avec succès." });
  } catch (error: unknown) {

    if (error instanceof Error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(409).json({ message: "Un exercice avec ce nom existe déjà !" });
      } else {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'exercice.", error: error.message });
      }
    } else {
      res.status(500).json({ message: "Erreur inconnue lors de la mise à jour de l'exercice." });
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
      handleError(res, error, "Erreur lors du chargement des exercices.");
    } else {
      handleError(res, error, "Erreur inconnue lors du chargement des exercices.");
    }
  }
};

/**
 * Returns a specific exercise based on its key.
 */
export const getExercise = async (req: Request, res: Response) => {
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
export const createExerciseVersion = async (req: Request, res: Response) => {
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
export const addExerciseVersion = async (req: Request, res: Response) => {
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
export const deleteExercise = async (req: Request, res: Response) => {
  const exerciseKey = req.params.exerciseKey;
  try {
    const exercise = await Exercise.findOne({ where: { key: exerciseKey } });
    if (!exercise) {
      return res.status(404).json({ message: "Exercice non trouvé !" });
    }

    await exercise.destroy();

    // Utilisation de l'optional chaining pour vérifier imageUrl
    if (exercise.imageUrl?.startsWith("/uploads")) {
      deleteFile(exercise.imageUrl); // Nettoyer uniquement les fichiers locaux
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