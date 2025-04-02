import { Exercise } from "../model/Exercise";
import { ExerciseVersion } from "../model/ExerciseVersion";
import { Variant } from "../model/Variant";
import { SessionRecord } from "../model/SessionRecord";
import { Bloc_Session } from "../model/Bloc_Session";
import { Exercise_Bloc } from "../model/Exercise_Bloc";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import { deleteFile } from "../util/file";
import { UniqueConstraintError } from "sequelize";


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
const IMAGES_DIR = path.resolve(__dirname, "..", "images");
/**
 * Returns an exercise image.
 */
export const getImage = (req: Request, res: Response) => {
  const { imageName } = req.params;
  const imagePath = path.join(__dirname, "./images", imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).json({ message: "Image not found" });
    }
  });
};

/**
 * Creates a new Exercise.
 */
export const createExercise = async (req: Request, res: Response) => {
  const { name, description, category, fitnessLevel, videoUrl } = req.body;
  const exerciseImageFile = req.file;

  if (!name || !description || !category || !fitnessLevel) {
    return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis !" });
  }

  // Check if exercise already exists
  const existingExercise = await Exercise.findOne({ where: { name } });
  if (existingExercise) {
    return res.status(409).json({ message: "Un exercice avec ce nom existe déjà !" });
  }

  // Validate video URL if provided
  const videoUrlRegex = /^(https?:\/\/)?(www\.)?(youtube|vimeo)\.(com|be)\/(watch\?v=|.*\/)([a-zA-Z0-9_-]{11,})$/;
  if (videoUrl && !videoUrlRegex.test(videoUrl)) {
    return res.status(400).json({ message: "URL vidéo invalide." });
  }

  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).json({ message: "Veuillez télécharger une image pour l'exercice." });
  }

  const imageUrl = `/images/${req.file.filename}`;

  // Create new exercise
  try {
    await Exercise.create({
      name,
      description,
      category,
      fitnessLevel,
      videoUrl,
      imageUrl,
    });

    // Return success response
    res.status(201).json({ message: "Exercice créé avec succès.", imageUrl });
  } catch (error: unknown) {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ message: "Un exercice avec ce nom existe déjà !" });
    }

    // Delete the uploaded file in case of an error
    if (req.file) {
      deleteFile(req.file.path);
    }

    // General error handler
    handleError(res, error, "Erreur lors de la création de l'exercice.");
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
      status: req.body.status ?? exercise.status,
    });

    res.status(200).json({ message: "Exercice mis à jour avec succès." });
  } catch (error: unknown) {


    if (error instanceof Error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(409).json({ message: "Un exercice avec ce nom existe déjà !" });
      } else {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'exercice.", error: error.message });
      }
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(409).json({ message: "Un exercice avec ce nom existe déjà !" });
      } else {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'exercice.", error: error.message });
      }
    } else {
      res.status(500).json({ message: "Erreur inconnue lors de la mise à jour de l'exercice." });
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
    if (exercise.imageUrl?.startsWith("/images")) {
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

exports.getExercisesByPatientId = async (req: any, res:any) => {
  const patientId = req.params.patientId;
  
  try {
    //Get all programEnrollment for this patient
    const programEnrollment = await ProgramEnrollement.findAll({
      where: { PatientId: patientId}
    });

    // Extract programEnrollment Ids
    const programEnrollementIds = programEnrollment.map((data: typeof ProgramEnrollement) => data.id);

    // Get all session records for this patient
    const sessionRecords = await SessionRecord.findAll({
      where: { ProgramEnrollementId: programEnrollementIds }
    });
    
    // Extract session IDs
    const sessionIds = sessionRecords.map((record: typeof SessionRecord) => record.id);
    
    // No sessions found for this patient
    if (sessionIds.length === 0) {
      return res.status(200).json([]);
    }
    
    // Find all bloc-session relationships for these sessions
    const blocSessions = await Bloc_Session.findAll({
      where: { SessionId: sessionIds }
    });
    
    // Extract bloc IDs
    const blocIds = blocSessions.map((bs: typeof Bloc_Session) => bs.BlocId);
    
    // No blocs found for these sessions
    if (blocIds.length === 0) {
      return res.status(200).json([]);
    }
    
    // Find all exercise-bloc relationships for these blocs
    const exerciseBlocs = await Exercise_Bloc.findAll({
      where: { BlocId: blocIds }
    });
    
    // Extract exercise IDs
    const exerciseIds = exerciseBlocs.map((eb: typeof exerciseBlocs) => eb.ExerciseId);
    
    // No exercises found for these blocs
    if (exerciseIds.length === 0) {
      return res.status(200).json([]);
    }
    
    // Get all exercises for these exercise IDs
    const exercises = await Exercise.findAll({
      where: { id: exerciseIds }
    });
    
    res.status(200).json(exercises);
  } catch (error) {
    console.error('Error fetching exercises by patient ID:', error);
    // Log more details about the error
  }
};