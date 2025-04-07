import { Exercise_Bloc } from "../model/Exercise_Bloc";
import { Session } from "../model/Session";
import { Bloc } from "../model/Bloc";
import { Bloc_Session } from "../model/Bloc_Session";
import { WeeklyCycle } from "../model/WeeklyCycle";
import { SessionDay } from "../model/SessionDay";

exports.setIsSessionFlexible = async (req: any, res: any, next: any) => {
  const isSessionsFlexible = req.body.isSessionsFlexible;
  const cycleKey = req.params.cycleKey;

  // Get the cycle to reference the session
  let cycle;
  try {
    cycle = await WeeklyCycle.findOne({ where: { key: cycleKey } });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: "cycle_not_found" });
  }
  if (cycle == null) {
    res.status(500);
    res.json({ message: "cycle_weekly_non_existant" });
    return res;
  }

  try {
    await cycle.update({
      isSessionsFlexible: isSessionsFlexible,
    });
    res.status(200).json({ message: "cycle_updated" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: "cycle_not_updatable" });
  }
};

/**
 * This function creates an @type {WeeklyCycle}
 * @param {Object} req - The request, which contains the attribute values for creating a weekly cycle.
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
exports.createCycle = async (req: any, res: any, next: any) => {
  // Extract the required attribute values to create a Weekly Cycle
  const name = req.body.cycleName;
  const description = req.body.cycleDescription;

  /**
   * @todo validate the input values
   */

  // Use sequelize (Database Framework) to create the Exercise
  try {
    const cycle = await WeeklyCycle.create({
      name: name,
      description: description,
      isSessionsFlexible: false,
    });

    res.status(201).json({ message: "cycle_created_success" });
    // Otherwise, the action was not successful. Hence, let the user know that
    // his request was unsuccessful.
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    if (error.name == "SequelizeUniqueConstraintError") {
      res.json({
        messageTitle: "cycle_error_same_name",
        message: "msg_alert_session_name_modification",
      });
    } else {
      res.json({
        messageTitle: "cycle_failed_creation",
        message:"contact_developer_message"
      });
    }
  }
  // return the response.
  return res;
};

/**
 * This function adds a session to an existing weekly cycle.
 *
 * @param {Object} req - The request, which contains the required attribute values.
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
exports.addSession = async (req: any, res: any, next: any) => {
  // extract parameter values
  const cycleKey = req.params.cycleKey;
  const sessionNames = req.body;

  // Get the cycle to reference the day sessions
  let cycle;
  try {
    cycle = await WeeklyCycle.findOne({ where: { key: cycleKey } });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: "cycle_weekly_not_found" });
  }
  if (cycle == null) {
    res.status(500);
    res.json({ message: "cycle_weekly_non_existant" });
    return res;
  }

  // Get the sessions to be added to be referenced by each day session.
  const sessionName1 = sessionNames.sessionName1;
  let isValidSessionName = sessionName1 !== "" && sessionName1 !== null;
  if (isValidSessionName) {
    try {
      await createSessionDay(sessionName1, cycle, "DAY_ONE");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_one_session_failed" });
    }
  } else {
    try {
      await removeReferencedSessionDays(cycle, "DAY_ONE");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_one_session_delete_failed" });
    }
  }

  const sessionName2 = sessionNames.sessionName2;
  isValidSessionName = sessionName2 !== "" && sessionName2 !== null;
  if (isValidSessionName) {
    try {
      await createSessionDay(sessionName2, cycle, "DAY_TWO");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_two_session_failed" });
    }
  } else {
    try {
      await removeReferencedSessionDays(cycle, "DAY_TWO");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_two_session_delete_failed" });
    }
  }

  const sessionName3 = sessionNames.sessionName3;
  isValidSessionName = sessionName3 !== "" && sessionName3 !== null;
  if (isValidSessionName) {
    try {
      await createSessionDay(sessionName3, cycle, "DAY_THREE");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_three_session_failed" });
    }
  } else {
    try {
      await removeReferencedSessionDays(cycle, "DAY_THREE");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_three_session_delete_failed" });
    }
  }

  const sessionName4 = sessionNames.sessionName4;
  isValidSessionName = sessionName4 !== "" && sessionName4 !== null;
  if (isValidSessionName) {
    try {
      await createSessionDay(sessionName4, cycle, "DAY_FOUR");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_four_session_failed" });
    }
  } else {
    try {
      await removeReferencedSessionDays(cycle, "DAY_FOUR");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_four_session_delete_failed" });
    }
  }

  const sessionName5 = sessionNames.sessionName5;
  isValidSessionName = sessionName5 !== "" && sessionName5 !== null;
  if (isValidSessionName) {
    try {
      await createSessionDay(sessionName5, cycle, "DAY_FIVE");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_five_session_failed" });
    }
  } else {
    try {
      await removeReferencedSessionDays(cycle, "DAY_FIVE");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_five_session_delete_failed" });
    }
  }

  const sessionName6 = sessionNames.sessionName6;
  isValidSessionName = sessionName6 !== "" && sessionName6 !== null;
  if (isValidSessionName) {
    try {
      await createSessionDay(sessionName6, cycle, "DAY_SIX");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_six_session_failed" });
    }
  } else {
    try {
      await removeReferencedSessionDays(cycle, "DAY_SIX");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_six_session_delete_failed" });
    }
  }

  const sessionName7 = sessionNames.sessionName7;
  isValidSessionName = sessionName7 !== "" && sessionName7 !== null;
  if (isValidSessionName) {
    try {
      await createSessionDay(sessionName7, cycle, "DAY_SEVEN");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_seven_session_failed" });
    }
  } else {
    try {
      await removeReferencedSessionDays(cycle, "DAY_SEVEN");
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "day_seven_session_delete_failed" });
    }
  }

  // Update the flexibility of the cycle
  const isSessionsFlexible = req.body.isSessionsFlexible;
  try {
    await cycle.update({
      isSessionsFlexible: isSessionsFlexible,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: "not_updatable_weekly_cycle" });
  }

  return res.status(200).json({ message: "weekly_cycle_updated" });
};

/**
 *
 * @param sessionName Creates an instance of SessionDay, which connects a weekly cycle
 * with a session.
 * @param cycle - the weekly cycle
 * @param weekDay - the week day for the session
 */
async function createSessionDay(sessionName: any, cycle: any, weekDay: any) {
  let session;
  try {
    session = await Session.findOne({
      where: { name: sessionName },
    });
  } catch (error: any) {
    throw new Error("cant_find_session");
  }

  if (session == null) {
    throw new Error(`session_non_existent`);
  }

  // remove referenced day sessions, if any exists.
  try {
    await removeReferencedSessionDays(cycle, weekDay);
  } catch (error: any) {
    throw new Error(error.message);
  }

  // create the session day to connect the cycle with the session for the designated day.
  let sessionDay;
  try {
    sessionDay = await cycle.createSessionDay({
      weekDay: weekDay,
      SessionId: session.id,
    });
  } catch (error: any) {
    console.log(error);
  }
}

/**
 * Removes instances of SessionDay when a given cycle doesn't reference the session,
 * or before allowing the cycle to reference another session on the same week day.
 * @param cycle - the weekly cycle in question.
 * @param weekDay - week day for the session.
 */
async function removeReferencedSessionDays(cycle: any, weekDay: any) {
  let sessionDays;
  try {
    sessionDays = await cycle.getSessionDays({
      where: { weekDay: weekDay },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw new Error("loadng_session_day_failed");
  }

  for (let sessionDay of sessionDays) {
    await sessionDay.destroy();
  }
}

/**
 * Retrieves a specific weekly cycle with a given key
 */
exports.getCycle = async (req: any, res: any, next: any) => {
  const cycleKey: String = req.params.cycleKey;
  try {
    const cycle = await WeeklyCycle.findOne({
      where: { key: cycleKey },
      include: [
        {
          model: SessionDay,
          include: [
            {
              model: Session,
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
            },
          ],
        },
      ],
    });
    res.status(200).json(cycle);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "error_loading_weekly_cycle" });
  }
};

/**
 * Retrieves all exisiting weekly cycles
 */
exports.getCycles = async (req: any, res: any, next: any) => {
  try {
    const cycles = await WeeklyCycle.findAll({
      include: [
        {
          model: SessionDay,
          include: [
            {
              model: Session,
            },
          ],
        },
      ],
    });
    res.status(200).json(cycles);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "error_loading_all_weekly_cycle" });
  }
  return res;
};

/**
 * Deletes a weekly cycle
 */
exports.deleteCycle = async (req: any, res: any, next: any) => {
  const cycleKey = req.params.cycleKey;
  let cycle;
  try {
    cycle = await WeeklyCycle.findOne({
      where: {
        key: cycleKey,
      },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "cycle_non_existant_database" });
  }
  try {
    await cycle.destroy();
    return res
      .status(200)
      .json({ message: "succes_weekly_cycle_deleted" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "failed_weekly_cycle_delete" });
  }
};

/**
 * Updates an exisitng weekly cycle.
 */
exports.updateCycle = async (req: any, res: any, next: any) => {
  const cycleKey = req.params.cycleKey;
  const name = req.body.name;
  const description = req.body.description;

  let cycle;

  try {
    cycle = await WeeklyCycle.findOne({
      where: { key: cycleKey },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "error_weekly_cycle_not_found" });
    return res;
  }

  /**
   * @todo validate the input values
   */

  // Use sequelize (Database Framework) to update the exercise day session
  try {
    await cycle.update({
      name: name,
      description: description,
    });

    res.status(200).json({ message: "specific_cycle_updated" });
    // Otherwise, the action was not successful. Hence, let the user know that
    // his request was unsuccessful.
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    res
      .status(error.statusCode)
      .json({ message: "failed_update_cycle" });
  }
};

/**
 * Returns sessions based on a given cycle
 */
exports.getSessions = async (req: any, res: any, next: any) => {
  const cycleKey = req.params.cycleKey;
  let cycle;
  try {
    cycle = await WeeklyCycle.findOne({
      where: { key: cycleKey },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "error_weekly_cycle_not_found_database" });

    return res;
  }

  try {
    const sessions = await cycle.getSessionDays({
      include: { model: Session },
    });
    res.status(200).json(sessions);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "failed_loading_session" });
  }
  return res;
};
