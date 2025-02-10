import { Exercise } from "../model/Exercise";
import { ExerciseVersion } from "../model/ExerciseVersion";
import { Variant } from "../model/Variant";
import fs from "fs";
import path from "path";

const fileHelper = require("./../util/file");

/**
 * Returns an exercise image
 */
exports.getImage = async (req: any, res: any) => {
  const imageName = req.params.imageName;
  const readImageStream = fs.createReadStream(`images/${imageName}`);
  readImageStream.pipe(res);
};

/**
 * This function creates an instance of @type {Exercise}
 * @param {Object} req - The request, which contains the name, description, and
 * a link to the instructional video for the new exercise.
 * @param {Object} res - The request response.
 * @param {Object} next - The next function, which calls the next middleware.
 * However, The next function is not used here because the request is returned
 * after executing this function.
 *
 * @returns {Object} res - The response, which contains details to alert the user
 * whether the create action was successfull or not.
 *
 * @author Hyacinth Ali
 */
exports.createExercise = async (req: any, res: any, next: any) => {
  // Extract the required attribute values to create an Exercise
  const name = req.body.name;
  const description = req.body.description;
  const instructionalVideo = req.body.instructionalVideo;
  const category = req.body.category;
  const isSeating = req.body.isSeating;
  const targetAgeRange = req.body.targetAgeRange;
  const fitnessLevel = req.body.fitnessLevel;
  const exerciseImageFile = req.file;

  /**
   * @todo validate the input values
   */

  const imageUrl = exerciseImageFile?.path || "";

  // Use sequelize (Database Framework) to create the Exercise
  try {
    await Exercise.create({
      name: name,
      description: description,
      instructionalVideo: instructionalVideo,
      category: category,
      isSeating: isSeating,
      targetAgeRange: targetAgeRange,
      fitnessLevel: fitnessLevel,
      imageUrl: imageUrl,
    });
    res.status(201).json({
      message: "Successfully created an Exercise",
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    // delete the image
    if (imageUrl) {
      fileHelper.deleteFile(imageUrl);
    }

    // initialize the status code
    res.status(error.statusCode);

    if (error.name == "SequelizeUniqueConstraintError") {
      res.json({
        messageTitle: "An exercise with the same name already exists.",
        message:
          "Please modify the name of the exercise and then submit again.",
      });
    } else {
      res.json({
        messageTitle: "Failed to create an Exercise",
        message:
          "Please contact the developer with a brief description of how this error can be reproduced.",
      });
    }
  }
};

/**
 * Updates an exercise.
 * @author Hyacinth Ali
 */
exports.updateExercise = async (req: any, res: any, next: any) => {
  // Extract the required attribute values to update an Exercise
  const key = req.params.exerciseKey;
  const name = req.body.name;
  const description = req.body.description;
  const instructionalVideo = req.body.instructionalVideo;
  const category = req.body.category;
  const isSeating = req.body.isSeating;
  const targetAgeRange = req.body.targetAgeRange;
  const fitnessLevel = req.body.fitnessLevel;

  let exercise;
  try {
    exercise = await Exercise.findOne({
      where: { key: key },
    });
    if (exercise == null) {
      res.json({ message: "Error: Can't find the exercise" });
      return res;
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "Error: Can't find the exercise" });
    return res;
  }

  // Use sequelize (Database Framework) to update the Exercise
  try {
    await exercise.update({
      name: name || exercise.name,
      description: description || exercise.description,
      instructionalVideo: instructionalVideo || exercise.instructionalVideo,
      category: category || exercise.category,
      isSeating: isSeating || exercise.isSeating,
      targetAgeRange: targetAgeRange || exercise.targetAgeRange,
      fitnessLevel: fitnessLevel || exercise.fitnessLevel,
    });
    res.status(201).json({
      message: "Successfully updated the Exercise",
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    // initialize the status code
    res.status(error.statusCode);

    if (error.name == "SequelizeUniqueConstraintError") {
      res.json({
        message:
          "Please modify the name of the exercise and then submit again.",
      });
    } else {
      res.json({
        message:
          "Error - Please contact the developer with a brief description of how this error can be reproduced.",
      });
    }
  }
};

/**
 * Returns all the exercises that exist in the database
 */
exports.getExercises = async (req: any, res: any, next: any) => {
  try {
    const exercises = await Exercise.findAll();
    res.status(200).json(exercises);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "Error loading exercises from the database" });
  }
  return res;
};

/**
 * Returns a specific exercise based on its name.
 */
exports.getExercise = async (req: any, res: any, next: any) => {
  const exerciseKey: String = req.params.exerciseKey;
  try {
    const exercise = await Exercise.findOne({
      where: { key: exerciseKey },
      include: ExerciseVersion,
    });
    res.status(200).json(exercise);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "Error loading the exercise from the database" });
  }
  return res;
};

/**
 * This function creates an instance of @type {ExerciseVersion}
 * @param {Object} req - The request, which contains the name, number of repitions, and
 * a link to the instructional video for the new exercise version.
 * @param {Object} res - The request response.
 * @param {Object} next - The next function, which calls the next middleware.
 * However, Th next function is not used here because the request is returned
 * after executing this function.
 *
 * @returns {Object} res - The response, which contains details to alert the user
 * whether the create action was successfull or not.
 *
 * @author Hyacinth Ali
 */
exports.createExerciseVersion = async (req: any, res: any, next: any) => {
  // Extract the required attribute values to create an Exercise
  const name = req.body.name;
  const numberOfRepitions = req.body.numberOfRepitions;
  const instructionalVideo = req.body.instructionalVideo;

  /**
   * @todo validate the input values
   */

  // Use sequelize (Database Framework) to create the ExerciseVersion
  try {
    const exerciseVersion = await ExerciseVersion.create({
      name: name,
      numberOfRepitions: numberOfRepitions,
      instructionalVideo: instructionalVideo,
    });

    res.status(201).json({ message: "Exercise version created" });
  } catch (error: any) {
    // Otherwise, the action was not successful. Hence, let the user know that
    // his request was unsuccessful.
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    res.json({ message: "Failed to create an exercise version" });
  }

  // returns the response.
  return res;
};

/**
 * This function adds a new exercise version to an existing exercise, i.e., instantiating
 * the exercise variant. See the model associations for further details.
 *
 * @param {Object} req - The request, which contains the exisitng exercise name,
 * existing exercise version name, and the level of the new variant.
 * @param {Object} res - The request response, which informs user whether the operation
 * was successful or not.
 * @param {Object} next - The next function, which calls the next middleware.
 * However, Th next function is not used here because the request is returned
 * after executing this function.
 *
 * @returns {Object} res - The response, which contains details to alert the user
 * whether the create action was successfull or not.
 *
 * @author Hyacinth Ali
 */
exports.addExerciseVersion = async (req: any, res: any, next: any) => {
  // Get the exercise that refers to the exercise version
  const exerciseName = req.body.exerciseName;
  let exercise;

  try {
    exercise = await Exercise.findOne({ where: { name: exerciseName } });
  } catch (error) {
    throw new Error("Can't find the exercise in the database.");
  }

  // Get the exercise version
  const versionName = req.body.versionName;
  let exerciseVersion;
  try {
    exerciseVersion = await ExerciseVersion.findOne({
      where: { name: versionName },
    });
  } catch (error) {
    throw new Error("Can't find the exercise version in the database");
  }

  // Extract the level value to create a variant, which connects the exercise and
  // the exercise version.
  const level = req.body.level;

  let variant;

  try {
    variant = await createVariant(exerciseVersion.id, exercise.id, level);

    res
      .status(201)
      .json({ message: "Added an exercise version to an exercise" });
  } catch (error: any) {
    res.status(500);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    console.log(error);

    res.json({ message: "Failed to add an exercise version to an exercise" });
    return res;
  }
};

/**
 * This function creates an instance of @type {Variant}
 * @param {Number} level - The level of an exercise.
 *
 * @returns {Variant} variant - The newly created variant or throws an exception if error occurs..
 *
 * @author Hyacinth Ali
 */
const createVariant = async (
  /**
   * @todo verify which id comes first
   */
  versionId: Number,
  exerciseId: Number,
  level: any
) => {
  // Use sequelize (Database Framework) to create the component
  try {
    const variant = await Variant.create({
      ExerciseVersionId: versionId,
      ExerciseId: exerciseId,
      level: level,
    });

    return variant;
  } catch (error: any) {
    throw new Error("Failed to create an exercise variant.");
  }
};

/**
 * Deletes an exercise
 */
exports.deleteExercise = async (req: any, res: any) => {
  const exerciseKey = req.params.exerciseKey;
  let exercise;
  try {
    exercise = await Exercise.findOne({
      where: {
        key: exerciseKey,
      },
    });
    if (exercise == null) {
      return res
        .status(500)
        .json({ message: "The exercise doesn't exist in the database" });
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "The exercise doesn't exist in the database" });
  }
  try {
    await exercise.destroy();
    if (exercise.imageUrl) {
      fileHelper.deleteFile(exercise.imageUrl);
    }
    return res
      .status(200)
      .json({ message: "Successfully deleted the exercise" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "Failed to delete the exercise" });
  }
};
