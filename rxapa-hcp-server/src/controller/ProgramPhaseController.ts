import { ProgramPhase } from "../model/ProgramPhase";
import { WeeklyCycle } from "../model/WeeklyCycle";
import { Phase_Cycle } from "../model/Phase_Cycle";
import { SessionDay } from "../model/SessionDay";

/**
 * This function creates an @type {ProgramPhase}
 * @param {Object} req - The request, which contains the attribute values for creating a program phase.
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
exports.createProgramPhase = async (req: any, res: any, next: any) => {
  // Extract the required attribute values to create a program phase
  const cycleName = req.body.cycleName;
  const name = req.body.name;
  const startConditionType = req.body.startConditionType;
  const startConditionValue = req.body.startConditionValue;
  const endConditionType = req.body.endConditionType;
  const endConditionValue = req.body.endConditionValue;
  const frequency = req.body.frequency;

  /**
   * @todo validate the input values
   */

  // Use sequelize (Database Framework) to create the ProgramPhase
  try {
    await ProgramPhase.create({
      name: name,
      startConditionType: startConditionType,
      startConditionValue: startConditionValue,
      endConditionType: endConditionType,
      endConditionValue: endConditionValue,
      frequency: frequency,
    });
    try {
      addCycle(cycleName, name, frequency);
    } catch (error: any) {
      res.status(500).json({
        messageTitle: "Failed to add the cycle to the new program phase",
        message:
          "Please contact the developer with a brief description of how this error can be reproduced.",
      });
    }

    res.status(201).json({ message: "Successfullly created a program phase" });
    // Otherwise, the action was not successful. Hence, let the user know that
    // his request was unsuccessful.
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    if (error.name == "SequelizeUniqueConstraintError") {
      res.json({
        messageTitle: "A program phase with the same name already exists.",
        message: "Please modify the name of the session and then submit again.",
      });
    } else {
      res.json({
        messageTitle: "Failed to create a program phase",
        message:
          "Please contact the developer with a brief description of how this error can be reproduced.",
      });
    }
  }
  // return the response.
  return res;
};

/**
 * This function updates a program phase with new value(s) for its attributes
 *
 * @param {Object} req - The request, which contains the values for the attributes of the program phase
 * @param {Object} res - The request response, which informs user whether the update operation
 * was successful or not.
 * @param {Object} next - The next function
 *
 * @returns {Object} res - The response, which contains details to alert the user
 * whether the update action was successfull or not.
 *
 * @author Hyacinth Ali
 */
exports.updateProgramPhase = async (req: any, res: any, next: any) => {
  // Get the program phase that needs to be updated
  const programPhaseKey = req.params.phaseKey;

  // get the program phase that requires to be updated.
  let programPhase;
  try {
    programPhase = await ProgramPhase.findOne({
      where: { key: programPhaseKey },
    });

    // Check that the program phase exists.
    if (programPhase == null) {
      res.status(500).json({ message: "The program phase does not exist." });
      return res;
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "Can't find the program phase in the database." });

    return res;
  }

  // Extract the attribute values to update the program phase
  const name = req.body.name;
  const startConditionType = req.body.startConditionType;
  const startConditionValue = req.body.startConditionValue;
  const endConditionType = req.body.endConditionType;
  const endConditionValue = req.body.endConditionValue;
  const frequency = req.body.frequency;

  try {
    await programPhase.update({
      name: name || programPhase.name,
      startConditionType: startConditionType || programPhase.startConditionType,
      startConditionValue:
        startConditionValue || programPhase.startConditionValue,
      endConditionType: endConditionType || programPhase.endConditionType,
      endConditionValue: endConditionValue || programPhase.endConditionValue,
      frequency: frequency || programPhase.frequency,
    });
    res.status(200).json({ message: "Successfully updated the program phase" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    res
      .status(error.statusCode)
      .json({ message: "Failed to update the program phase" });
  }

  return res;
};

/**
 * This function adds a weekly cycle to a program phase.
 *
 * @param {Object} req - The request, which contains the attribute values to a add cycle
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
exports.addCycle = async (req: any, res: any, next: any) => {
  // extract parameter values
  const cycleName = req.body.cycleName;
  const phaseName = req.body.phaseName;
  const numberOfRepetition = req.body.numberOfRepetition;

  // Get the cycle to be added to a program phase.
  let cycle;
  try {
    cycle = await WeeklyCycle.findOne({ where: { name: cycleName } });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: `Can't find ${cycleName}` });
  }

  // Get the porgram phase that will reference the weekly cycle
  let phase;
  try {
    phase = await ProgramPhase.findOne({
      where: { name: phaseName },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: `Can't find ${phaseName}` });
    return res;
  }

  if (phase == null) {
    res.status(500);
    res.json({ message: `${phaseName} doesn't exist` });
    return res;
  }

  // get the rank of the new cycle
  const rank = (await phase.countWeeklyCycles()) + 1;

  let phaseCycle;
  try {
    phaseCycle = await Phase_Cycle.create({
      ProgramPhaseId: phase.id,
      WeeklyCycleId: cycle.id,
      rank: rank,
      numberOfRepetition: numberOfRepetition,
    });
    res.status(201);
    res.json({
      message: `Successfully added ${cycleName} to ${phaseName} session`,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: "Failed to add the weekly cycle" });
    return res;
  }
};

/**
 * Retrieves a specific program phase with a given phase key
 */
exports.getProgramPhase = async (req: any, res: any, next: any) => {
  const phaseKey: String = req.params.phaseKey;
  try {
    const phase = await ProgramPhase.findOne({
      where: { key: phaseKey },
      include: [
        {
          model: Phase_Cycle,
          include: [
            {
              model: WeeklyCycle,
              include: [
                {
                  model: SessionDay,
                },
              ],
            },
          ],
        },
      ],
    });
    res.status(200).json(phase);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "Error loading the program phase" });
  }
};

/**
 * Retrieves all exisiting program phases
 */
exports.getProgramPhases = async (req: any, res: any, next: any) => {
  try {
    const phases = await ProgramPhase.findAll({
      include: [
        {
          model: Phase_Cycle,
          include: [
            {
              model: WeeklyCycle,
            },
          ],
        },
      ],
    });
    res.status(200).json(phases);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.json({ message: "Error loading program phases" });
  }
  return res;
};

/**
 * Adds a new cycle to a program phase.
 * @param cycleName
 * @param phaseName
 * @param numberOfRepetition
 */
async function addCycle(
  cycleName: String,
  phaseName: String,
  numberOfRepetition: Number
) {
  // Get the cycle to be added to a program phase.
  let cycle;
  try {
    cycle = await WeeklyCycle.findOne({ where: { name: cycleName } });
  } catch (error: any) {
    throw new Error(error);
  }

  // Get the porgram phase that will reference the weekly cycle
  let phase;
  try {
    phase = await ProgramPhase.findOne({
      where: { name: phaseName },
    });
  } catch (error: any) {
    throw new Error(error);
  }

  let phaseCycle;
  try {
    phaseCycle = await Phase_Cycle.create({
      ProgramPhaseId: phase.id,
      WeeklyCycleId: cycle.id,
      numberOfRepetition: numberOfRepetition,
    });
  } catch (error: any) {
    throw new Error(error);
  }
}

exports.deleteProgramPhase = async (req: any, res: any) => {
  const phaseKey = req.params.phaseKey;
  let phase;
  try {
    phase = await ProgramPhase.findOne({
      where: {
        key: phaseKey,
      },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "The program phase doesn't exist in the database" });
  }
  try {
    await phase.destroy();
    return res
      .status(200)
      .json({ message: "Successfully deleted the program phase" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "Failed to delete the program phase" });
  }
};
