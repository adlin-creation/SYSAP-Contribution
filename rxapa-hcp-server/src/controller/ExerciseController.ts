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
const IMAGES_DIR = path.resolve(__dirname, "..", "images");
/**
 * Returns an exercise image.
 */
export const getImage = (req: Request, res: Response) => {
  const { imageName } = req.params;
  const imagePath = path.join(__dirname, "./images", imageName);

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).json({ message: "image_not_found" });
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
    return res.status(400).json({ message: "all_fields_required" });
  }

  // Check if exercise already exists
  const existingExercise = await Exercise.findOne({ where: { name } });
  if (existingExercise) {
    return res.status(409).json({ message: "exercise_already_exists" });
  }

  // Validate video URL if provided
  const videoUrlRegex =
    /^(https?:\/\/)?(www\.)?(youtube|vimeo)\.(com|be)\/(watch\?v=|.*\/)([a-zA-Z0-9_-]{11,})$/;
  if (videoUrl && !videoUrlRegex.test(videoUrl)) {
    return res.status(400).json({ message: "error_invalid_video_url" });
  }

  // Check if file is uploaded
  if (!req.file) {
    return res.status(400).json({ message: "error_upload_image_exercise" });
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
      status: req.body.status || "active"
    });

    // Return success response
    res
      .status(201)
      .json({ message: "exercise_created_successfully", imageUrl });
  } catch (error: unknown) {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ message: "exercise_already_exists" });
    }

    // Delete the uploaded file in case of an error
    if (req.file) {
      deleteFile(req.file.path);
    }

    // General error handler
    handleError(res, error, "error_creating_exercise");
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
      return res.status(404).json({ message: "exercise_not_found" });
    }

    await exercise.update({
      name: name || exercise.name,
      description: description || exercise.description,
      category: category || exercise.category,
      fitnessLevel: fitnessLevel || exercise.fitnessLevel,
      videoUrl: videoUrl || exercise.videoUrl,
      status: req.body.status ?? exercise.status,
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
        message: "unknown_error_updating_exercise",
      });
      res.status(500).json({
        message: "unknown_error_updating_exercise",
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
    if (exercise.imageUrl?.startsWith("/images")) {
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

exports.getExercisesByPatientId = async (req: any, res: any) => {
  const patientId = req.params.patientId;

  try {
    //Get all programEnrollment for this patient
    const programEnrollment = await ProgramEnrollement.findAll({
      where: { PatientId: patientId },
    });

    // Extract programEnrollment Ids
    const programEnrollementIds = programEnrollment.map(
      (data: typeof ProgramEnrollement) => data.id
    );

    // Get all session records for this patient
    const sessionRecords = await SessionRecord.findAll({
      where: { ProgramEnrollementId: programEnrollementIds },
    });

    // Extract session IDs
    const sessionIds = sessionRecords.map(
      (record: typeof SessionRecord) => record.id
    );

    // No sessions found for this patient
    if (sessionIds.length === 0) {
      return res.status(200).json([]);
    }

    // Find all bloc-session relationships for these sessions
    const blocSessions = await Bloc_Session.findAll({
      where: { SessionId: sessionIds },
    });

    // Extract bloc IDs
    const blocIds = blocSessions.map((bs: typeof Bloc_Session) => bs.BlocId);

    // No blocs found for these sessions
    if (blocIds.length === 0) {
      return res.status(200).json([]);
    }

    // Find all exercise-bloc relationships for these blocs
    const exerciseBlocs = await Exercise_Bloc.findAll({
      where: { BlocId: blocIds },
    });

    // Extract exercise IDs
    const exerciseIds = exerciseBlocs.map(
      (eb: typeof exerciseBlocs) => eb.ExerciseId
    );

    // No exercises found for these blocs
    if (exerciseIds.length === 0) {
      return res.status(200).json([]);
    }

    // Get all exercises for these exercise IDs
    const exercises = await Exercise.findAll({
      where: { id: exerciseIds },
    });

    res.status(200).json(exercises);
  } catch (error) {
    console.error("Error fetching exercises by patient ID:", error);
    // Log more details about the error
  }
};
