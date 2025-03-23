import { Exercise_Bloc } from "../model/Exercise_Bloc";
import { Session } from "../model/Session";
import { Bloc } from "../model/Bloc";
import { Bloc_Session } from "../model/Bloc_Session";

/**
 * This function creates an @type {Session}
 * @param {Object} req - The request, which contains the attribute values for creating a session.
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
exports.createSession = async (req: any, res: any, next: any) => {
  // Extract the required attribute values to create a Session
  const name = req.body.name;
  const description = req.body.description;
  const constraints = req.body.constraints;

  /**
   * @todo validate the input values
   */

  // Use sequelize (Database Framework) to create the Exercise
  try {
    const exercise = await Session.create({
      name: name,
      description: description,
      constraints: constraints,
    });

    res.status(201).json({ message: "creation_session_success" });
    // Otherwise, the action was not successful. Hence, let the user know that
    // his request was unsuccessful.
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    if (error.name == "SequelizeUniqueConstraintError") {
      res.json({
        messageTitle: "error_same_session_name",
        message: "msg_alert_session_name_modification",
      });
    } else {
      res.json({
        messageTitle: "session_creation_failed",
        message: "contact_developper_for_bug",
      });
    }
  }

  // return the response.
  return res;
};

/**
 * This function adds an exercise to a session.
 *
 * @param {Object} req - The request, which contains the exisitng exercise day session name,
 * existing exercise name, rank, required, and number of the series of the new component,
 * i.e., the through table connecting ExerciseDaySession with Exercise.
 * @param {Object} res - The request response, which inform user whether the operation
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
exports.addBloc = async (req: any, res: any, next: any) => {
  // extract parameter values
  const blocName = req.body.blocName;
  const sessionKey = req.params.sessionKey;
  const required = req.body.required as boolean;
  const dayTime = req.body.dayTime;

  // Get the bloc to be added to a session.
  let bloc;
  try {
    bloc = await Bloc.findOne({ where: { name: blocName } });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: "cant_find" + ` ${blocName}` });
  }

  // Get the session to reference the bloc session
  let session;
  try {
    session = await Session.findOne({
      where: { key: sessionKey },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: "cant_find_session" });
    return res;
  }

  if (session == null) {
    res.status(500);
    res.json({ message: "session_non_existent" });
    return res;
  }

  // get the rank of the new bloc
  const rank = (await session.countBloc_Sessions()) + 1;

  let blocSession;
  try {
    blocSession = await Bloc_Session.create({
      SessionId: session.id,
      BlocId: bloc.id,
      rank: rank,
      required: required,
      dayTime: dayTime,
    });
    res.status(201);
    res.json({
      message: "session_add_success",
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: "session_add_failed" });
    return res;
  }
};

/**
 * Retrieves a specific session with a given session key
 */
exports.getSession = async (req: any, res: any, next: any) => {
  const sessionKey: String = req.params.sessionKey;
  try {
    const session = await Session.findOne({
      where: { key: sessionKey },
      include: [
        {
          model: Bloc_Session,
          include: [
            {
              model: Bloc,
              include: [
                {
                  model: Exercise_Bloc,
                },
              ],
            },
          ],
        },
      ],
    });
    res.status(200).json(session);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "session_exercise_load_failed" });
  }
};

/**
 * Retrieves all exisiting sessions
 */
exports.getSessions = async (req: any, res: any, next: any) => {
  try {
    const sessions = await Session.findAll();
    res.status(200).json(sessions);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "error_load_session" });
  }
  return res;
};

/**
 * Updates an exisitng exercise day session
 */
exports.updateSession = async (req: any, res: any, next: any) => {
  // Extract the required attribute values to update an exercise day session
  const sessionKey = req.params.sessionKey;
  const name = req.body.name;
  const description = req.body.description;
  const constraints = req.body.constraints;

  let session;

  try {
    session = await Session.findOne({
      where: { key: sessionKey },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "cant_find " + `${name}` + "session_word"});
    return res;
  }

  // Use sequelize (Database Framework) to update the exercise day session
  try {
    await session.update({
      name: name || session.name,
      description: description || session.description,
      constraints: constraints || session.constraints,
    });
    res.status(200).json({ message: "session_updated" });
    // Otherwise, the action was not successful. Hence, let the user know that
    // his request was unsuccessful.
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    res.json({ message: "failed_update" + ` ${name}` });
  }
};

exports.deleteSession = async (req: any, res: any) => {
  const sessionKey = req.params.sessionKey;

  // retreive the session to be deleted
  let session;
  try {
    session = await Session.findOne({
      where: { key: sessionKey },
    });
    // Check that the session exists
    if (session == null) {
      return res.status(500).json({ message: "session_non_existent" });
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "failed_retrive_session_deletion" });
  }

  // Delete the session.
  try {
    await session.destroy();
    res.status(200).json({ message: "session_delete_success" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "session_not_deletable" });
  }
};
