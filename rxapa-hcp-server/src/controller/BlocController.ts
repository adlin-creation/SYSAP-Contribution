import { Exercise_Bloc } from "../model/Exercise_Bloc";
import { Exercise } from "../model/Exercise";
import { Bloc } from "../model/Bloc";
import { Patient } from "../model/Patient";
import { SessionRecord } from "../model/SessionRecord";
import { Session } from "../model/Session";
import { Bloc_Session } from "../model/Bloc_Session";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import { BlocHistory } from "../model/BlocHistory";

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
  // save changes in BlocHistory
  const changes = [];

  if (bloc.name !== blocName) {
    changes.push({
      blocId: bloc.id,
      field: "name",
      oldValue: bloc.name,
      newValue: blocName,
    });
  }

  if (bloc.description !== description) {
    changes.push({
      blocId: bloc.id,
      field: "description",
      oldValue: bloc.description,
      newValue: description,
    });
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

    for (const change of changes) {
      await BlocHistory.create(change);
    }

    res.status(200).json({ message: `The bloc has been updated` });
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

/**
 * Deletes a specific exercise from a bloc
 */
exports.removeExerciseFromBloc = async (req: any, res: any) => {
  const { blocId, exerciseId } = req.body;

  try {
    const result = await Exercise_Bloc.destroy({
      where: {
        BlocId: blocId,
        ExerciseId: exerciseId,
      },
    });

    if (result > 0) {
      res
        .status(200)
        .json({ message: "Exercise successfully removed from the block." });
    } else {
      res.status(404).json({ message: "No matching entry found." });
    }
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).json({ message: "Server error occurred during deletion." });
  }
};

/*
  Retrieve all the blocs related to the patient Id
*/
exports.getBlocsByPatientId = async (req: any, res: any) => {
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

    // Get all blocs for these bloc IDs
    const blocs = await Bloc.findAll({
      where: { id: blocIds },
    });

    res.status(200).json(blocs);
  } catch (error) {
    console.error("Error fetching blocs by patient ID:", error);
    res.status(500).json({ message: "Failed to fetch blocs" });
  }
};
