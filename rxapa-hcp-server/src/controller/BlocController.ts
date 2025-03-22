import { Exercise_Bloc } from "../model/Exercise_Bloc";
import { Exercise } from "../model/Exercise";
import { Bloc } from "../model/Bloc";

/**
 * This function creates an @type {Bloc}
 * @param {Object} req - The request, which contains the attributes values that are required to instantiate Bloc table.
 * @param {Object} res - The request response object.
 * @param {Object} next - The next function.
 *
 * @returns {Object} res - The response, which contains details to alert the user
 * whether the create action was successfull or not.
 *
 * @author Hyacinth Ali
 */
exports.createBloc = async (req: any, res: any, next: any) => {
  // Extract the required attribute values
  const name = req.body.name;
  const description = req.body.description;

  /**
   * @todo validate the input values
   */

  // Use sequelize (Database Framework) to create the Bloc
  try {
    const bloc = await Bloc.create({
      name: name,
      description: description,
    });

    res.status(201).json({ message: "bloc_creation_success" });
    // Otherwise, the action was not successful. Hence, let the user know that
    // his request was unsuccessful.
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);

    if (error.name == "SequelizeUniqueConstraintError") {
      res.json({
        messageTitle: "same_name_bloc_message",
        message: "modify_bloc_name_message",
      });
    } else {
      res.json({
        messageTitle: "bloc_creation_failure_message",
        message: "contact_developer_message",
      });
    }
  }
};

/**
 * This function adds a new exercise to an existing day session.
 *
 * @param {Object} req - The request, which contains the required objects and attribute values
 * to add an exercise to a bloc
 * @param {Object} res - The request response object
 * @param {Object} next - The next function.
 *
 * @returns {Object} res - The response, which contains details to alert the user
 * whether the create action was successfull or not.
 *
 * @author Hyacinth Ali
 */
exports.addExercise = async (req: any, res: any, next: any) => {
  // Extract values
  const exerciseName = req.body.exerciseName;
  const blocKey = req.params.blocKey;
  const required = req.body.required as boolean;
  const numberOfSeries = req.body.numberOfSeries as number;
  const numberOfRepetition = req.body.numberOfRepetition as number;
  const restingInstruction = req.body.restingInstruction as string;
  const minutes = req.body.minutes as number;

  // Get the exercise to be added to a bloc.
  let exercise;
  try {
    exercise = await Exercise.findOne({ where: { name: exerciseName } });
  } catch (error) {
    res.json({ message: "cannot_find_exercise_message", exerciseName });
  }

  // Get the bloc
  let bloc;
  try {
    bloc = await Bloc.findOne({
      where: { key: blocKey },
    });
  } catch (error) {
    res.json({ message: "cannot_find_bloc_message" });
  }

  const rank = (await bloc.countExercise_Blocs()) + 1;
  try {
    await Exercise_Bloc.create({
      BlocId: bloc.id,
      ExerciseId: exercise.id,
      rank: rank,
      required: required,
      numberOfSeries: numberOfSeries,
      numberOfRepetition: numberOfRepetition,
      restingInstruction: restingInstruction,
      minutes: minutes,
    });
    res.status(201).json({ message: "exercise_adding_success_message" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({
      message: "exercise_add_fail",
      exerciseName: exerciseName,
    });
    return res;
  }
};

/**
 * Retrieves all the blocs from the database.
 */
exports.getBlocs = async (req: any, res: any, next: any) => {
  try {
    const blocs = await Bloc.findAll();
    res.status(200).json(blocs);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "database_bloc_loading_error" });
  }
  return res;
};

/**
 * Retrieves a specific bloc from the database.
 */
exports.getBloc = async (req: any, res: any, next: any) => {
  const blocKey: String = req.params.blocKey;
  try {
    const bloc = await Bloc.findOne({
      where: { key: blocKey },
      include: [
        {
          model: Exercise_Bloc,
          include: [
            {
              model: Exercise,
            },
          ],
        },
      ],
    });
    res.status(200).json(bloc);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: "database_bloc_loading_error" });
  }
};

/**
 * Updates an exisitng bloc
 */
exports.updateBloc = async (req: any, res: any, next: any) => {
  // Extract the required attribute values to update a bloc
  const key = req.params.blocKey;
  const blocName = req.body.name;
  const description = req.body.description;

  let bloc;
  try {
    bloc = await Bloc.findOne({
      where: { key: key },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "cannot_find_bloc_message" });
    return res;
  }

  if (bloc == null) {
    res.json({ message: "cannot_find_bloc_message" });
    return res;
  }

  /**
   * @todo validate the input values
   */

  // Use sequelize (Database Framework) to update the bloc
  try {
    await bloc.update({
      name: blocName || bloc.name,
      description: description || bloc.description,
    });

    res.status(200).json({ message: `bloc_update_success` });
    // Otherwise, the action was not successful. Hence, let the user know that
    // his request was unsuccessful.
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "bloc_update_fail", blocName: blocName });
  }
};

/**
 * Deletes a bloc
 */
exports.deleteBloc = async (req: any, res: any, next: any) => {
  const blocKey = req.params.blocKey;
  let bloc;
  try {
    bloc = await Bloc.findOne({
      where: {
        key: blocKey,
      },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res.status(error.statusCode).json({ message: "bloc_not_found" });
  }
  try {
    await bloc.destroy();
    return res.status(200).json({ message: "bloc_deleted_successfully" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "bloc_deletion_failed" });
  }
};
