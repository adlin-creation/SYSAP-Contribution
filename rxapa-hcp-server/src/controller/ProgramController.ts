import { Exercise } from "../model/Exercise";
import { Session } from "../model/Session";
import { ExerciseVersion } from "../model/ExerciseVersion";
import { Program } from "../model/Program";
import { ProgramPhase } from "../model/ProgramPhase";
import { Variant } from "../model/Variant";
import { ProgramPhase_Program } from "../model/ProgramPhase_Program";
import { validateProgram } from "../middleware/validateProgram";
import { ProgramSession } from '../model/ProgramSession';

import fs from "fs";

/**
 * This function creates an instance of @type {Program}
 * @param {Object} req - The request, which contains the name, description, and
 * duration of the new program.
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
exports.createProgram = [ 
    validateProgram, 
    async (req: any, res: any, next: any) => {
    // Extract the required attribute values to create an Exercise
    const name = req.body.name;
    const description = req.body.description;
    const duration = req.body.duration;
    const duration_unit = req.body.duration_unit;
    const imageUrl = req.body.imageUrl;
    const sessions = req.body;
    // const sessions = req.body['sessions[]'];

    console.log("Parsed sessions:", sessions);

    // Use sequelize (Database Framework) to create the Exercise
    try {
      
      console.log("Body received:", req.body);
      console.log("File received:", req.file);
      console.log("Sessions received:", req.body.sessions);

      const rawSessions = req.body.sessions;
      console.log("Sessions received (raw):", rawSessions);

      const sessions = rawSessions ? JSON.parse(rawSessions) : [];
      console.log("Parsed sessions:", sessions);

      // // Extraire les attributs nécessaires pour créer le programme
      // const { name, description, duration, duration_unit, sessions } = req.body;

      let imagePath = "";

      if (req.file) {
        imagePath = `/images/${req.file.filename}`; //Stockage local
      } else if (imageUrl) {
        console.log("Received Image URL:", imageUrl);
        imagePath = imageUrl; // Si l'utilisateur a fourni un lien
      } else {
        return res
        .status(400)
        .json({ message: "No given image" });
      }

      const program = await Program.create({
        name: name,
        description: description,
        duration: duration,
        duration_unit : duration_unit,
        image: imagePath,
      });

      // // Associer les sessions au programme
      if (req.body.sessions) {
        const sessionIds = req.body.sessions; // Un tableau de sessions
        for (const sessionId of sessionIds) {
          await ProgramSession.create({
            programId: program.id,
            sessionId,
          });
        }
      }

      res.status(201).json({ message: "Exercise program created" });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "Failed to create an exercise program" });
    }
    return res;
  },
];

/**
 * Retrieves all programs
 */
exports.getPrograms = async (req: any, res: any, next: any) => {
  try {
    const programs = await Program.findAll();
    res.status(200).json(programs);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "Error loading programs from the database" });
  }
  return res;
};

/**
 * Return program phases based on a given program
 */
exports.getProgramPhases = async (req: any, res: any, next: any) => {
  const programKey = req.params.programKey;
  let program;
  try {
    program = await Program.findOne({
      where: { key: programKey },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "Error, can't the find program in the database" });

    return res;
  }

  try {
    const programPhases = await program.getProgramPhase_Programs({
      // sorts the program phases in ascending order based on its order attribute.
      order: [["rank", "ASC"]],
      include: { model: ProgramPhase },
    });

    /**
     * @todo: this initialization maybe needed in future, it will require to be updated
     * to align with the current database schema.
     */
    // initializePhaseState(programPhases);

    res.status(200).json(programPhases);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "Failed to load program phases" });
  }
  return res;
};

/**
 * Retrieves a program with a given key
 */
exports.getProgram = async (req: any, res: any, next: any) => {
  const programKey: String = req.params.programKey;
  try {
    const program = await Program.findOne({
      where: { key: programKey },
      include: [
        {
          model: ProgramPhase_Program,
          include: [
            {
              model: ProgramPhase,
            },
          ],
        },
      ],
    });
    res.status(200).json(program);
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode);
    res.json({ message: "Error loading a program from the database" });
    return res;
  }
};

/**
 * This function adds a program phase to an existing program, i.e., instantiating
 * the @type {ProgramPhase}. See the model associations for further details.
 *
 * @param {Object} req - The request, which contains the exisitng program name,
 * start condition type, start condition value,
 * end condition type, end condition value, and frequency required to create the
 * new program phase.
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
exports.addProgramPhase = async (req: any, res: any, next: any) => {
  const programKey = req.params.programKey;
  const phaseName = req.body.phaseName;

  // Get the program that will contain the new program phase
  let program;
  try {
    program = await Program.findOne({ where: { key: programKey } });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    res
      .status(error.statusCode)
      .json({ message: "Can't find the program in the database." });

    return res;
  }

  // Get the program phase
  let phase;
  try {
    phase = await ProgramPhase.findOne({
      where: { name: phaseName },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res
      .status(error.statusCode)
      .json({ message: "Can't find the selected phase" });

    return res;
  }

  const rank = (await program.countProgramPhase_Programs()) + 1;

  let programPhase_Program;
  // create an instance of the ProgramPhase_Program, a join table that
  // connects program with a program phase.
  try {
    programPhase_Program = await ProgramPhase_Program.create({
      ProgramId: program.id,
      ProgramPhaseId: phase.id,
      rank: rank,
    });

    res.status(201).json({ message: "Added a program phase to the program" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    res
      .status(error.statusCode)
      .json({ message: "Failed to add a program phase to a program" });
  }

  return res;
};

/**
 * Deletes a program phase.
 * @param {Object} req -  the request which contains the key of the program phase to be deleteed.
 */
exports.deleteProgram = async (req: any, res: any) => {
  const programKey = req.params.programKey;

  // retreive the program to be deleted
  let program;
  try {
    program = await Program.findOne({
      where: { key: programKey },
    });
    // Check that the programe exists
    if (program == null) {
      res.status(500).json({ message: "The program does not exist." });
      return res;
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "Failed to retrieve program to be deleted" });
  }

  // Delete the program.
  try {
    await program.destroy();
    res.status(200).json({ message: "Program Deleted Successfully" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "Unable to delete the program." });
  }
};

/**
 * Sets each of the program phases as active.
 * @param programPhases - the list of the program phases for a program.
 */
function initializePhaseState(programPhases: any) {
  // set all program phase inactive
  programPhases.map((phase: any) => (phase.isActive = false));

  let currentPhase;
  let counter = 0;
  while (counter < programPhases.length) {
    currentPhase = programPhases[counter];
    if (counter == 0) {
      // The first program phase should always be active
      currentPhase.isActive = true;
    } else {
      const previousPhase = programPhases[counter - 1];
      if (currentPhase.startConditionValue <= previousPhase.endConditionValue) {
        // Sets the current phase active because its start value is less or
        // equal to the end value of the previous phase
        currentPhase.isActive = true;
      } else {
        // stops the iteration when the current phase is not supposed to be active.
        break;
      }
    }
    counter++;
  }
  programPhases.map((phase: any) => phase.save());
}

/**
 * Updates an exisitng program.
 */
exports.updateProgram = async (req: any, res: any, next: any) => {
  const programKey = req.params.programKey;
  const name = req.body.name;
  const description = req.body.description;
  const duration = req.body.duration;

  let program;

  try {
    program = await Program.findOne({
      where: { key: programKey },
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

  // Use sequelize (Database Framework) to update the exercise day session
  try {
    await program.update({
      name: name,
      description: description,
      duration: duration,
    });

    res.status(200).json({ message: `The program has been updated` });
    // Otherwise, the action was not successful. Hence, let the user know that
    // his request was unsuccessful.
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    return res
      .status(error.statusCode)
      .json({ message: `Failed to update the program` });
  }
};
