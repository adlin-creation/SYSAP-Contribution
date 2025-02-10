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
    res.json({ message: `Can't find the weekly cycle` });
  }
  if (cycle == null) {
    res.status(500);
    res.json({ message: `The weekly cycle doesn't exist` });
    return res;
  }

  try {
    await cycle.update({
      isSessionsFlexible: isSessionsFlexible,
    });
    res.status(200).json({ message: "Updated the weekly cycle" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: `Can't update the weekly cycle` });
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

    res.status(201).json({ message: "Successfullly created a weekly cycle" });
    // Otherwise, the action was not successful. Hence, let the user know that
    // his request was unsuccessful.
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    if (error.name == "SequelizeUniqueConstraintError") {
      res.json({
        messageTitle: "A weekly cycle with the same name already exists.",
        message: "Please modify the name of the session and then submit again.",
      });
    } else {
      res.json({
        messageTitle: "Failed to create a weekly cycle",
        message:
          "Please contact the developer with a brief description of how this error can be reproduced.",
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
    res.json({ message: `Can't find the weekly cycle` });
  }
  if (cycle == null) {
    res.status(500);
    res.json({ message: `The weekly cycle doesn't exist` });
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
        .json({ message: "Failed to create day session for Day One" });
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
        .json({ message: "Failed to remove day session for Day One" });
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
        .json({ message: "Failed to create day session for Day Two" });
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
        .json({ message: "Failed to remove day session for Day Two" });
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
        .json({ message: "Failed to create day session for Day Three" });
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
        .json({ message: "Failed to remove day session for Day Three" });
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
        .json({ message: "Failed to create day session for Day Four" });
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
        .json({ message: "Failed to remove day session for Day Four" });
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
        .json({ message: "Failed to create day session for Day Five" });
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
        .json({ message: "Failed to remove day session for Day Five" });
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
        .json({ message: "Failed to create day session for Day Six" });
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
        .json({ message: "Failed to remove day session for Day Six" });
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
        .json({ message: "Failed to create day session for Day Seven" });
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
        .json({ message: "Failed to remove day session for Day Seven" });
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
    res.json({ message: `Can't update the weekly cycle` });
  }

  return res.status(200).json({ message: "Updated the weekly cycle" });
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
    throw new Error("Can't find the session");
  }

  if (session == null) {
    throw new Error(`The session doesn't exist`);
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
    throw new Error("Failed to load session days");
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
    res.json({ message: "Error loading the weekly cycle" });
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
    res.json({ message: "Error loading weekly cycles" });
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
      .json({ message: "The cycle doen't exist in the database" });
  }
  try {
    await cycle.destroy();
    return res
      .status(200)
      .json({ message: "Successfully deleted the weekly cycle" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "Failed to delete the weekly cycle" });
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
      .json({ message: `Error: Can't find the weekly cycle` });
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

    res.status(200).json({ message: `The cycle has been updated` });
    // Otherwise, the action was not successful. Hence, let the user know that
    // his request was unsuccessful.
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    res
      .status(error.statusCode)
      .json({ message: `Failed to update the cycle` });
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
    res.json({ message: "Error, can't the find weekly cycle in the database" });

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
    res.json({ message: "Failed to load sessions" });
  }
  return res;
};
