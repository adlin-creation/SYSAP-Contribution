import { Exercise } from "../model/Exercise";
import { Session } from "../model/Session";
import { ExerciseVersion } from "../model/ExerciseVersion";
import { Program } from "../model/Program";
import { ProgramPhase } from "../model/ProgramPhase";
import { Variant } from "../model/Variant";
import { ProgramPhase_Program } from "../model/ProgramPhase_Program";
import { validateProgram } from "../middleware/validateProgram";
import { ProgramSession } from "../model/ProgramSession";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import fs from "fs";
import { Op } from "sequelize";

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

    try {
      const rawSessions = req.body.sessions;

      // Vérification que les sessions sont bien dans un format tableau
      const sessions = Array.isArray(rawSessions) ? rawSessions : [];

      if (!sessions.length) {
        return res.status(400).json({ message: "error_no_valid_session" });
      }

      let imagePath = "";

      if (req.file) {
        imagePath = `/images/${req.file.filename}`; //Stockage local
      } else if (imageUrl) {
        imagePath = imageUrl; // Si l'utilisateur a fourni un lien
      } else {
        return res.status(400).json({ message: "error_no_image_provided" });
      }

      const program = await Program.create({
        name: name,
        description: description,
        duration: duration,
        duration_unit: duration_unit,
        image: imagePath,
      });

      // // Associer les sessions au programme
      if (sessions.length > 0) {
        const sessionIds = req.body.sessions;
        for (const sessionId of sessionIds) {
          await ProgramSession.create({
            programId: program.id,
            sessionId,
          });
        }
      }

      res.status(201).json({ message: "success_program_created" });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      return res
        .status(error.statusCode)
        .json({ message: "error_program_creation_failed" });
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
    res.status(error.statusCode).json({ message: "error_loading_programs" });
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
    res.status(error.statusCode).json({ message: "error_loading_programs" });

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
      .json({ message: "error_loading_program_phases" });
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
    res.json({ message: "error_loading_programs" });
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

    res.status(error.statusCode).json({ message: "error_loading_programs" });

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
    res.status(error.statusCode).json({ message: "error_loading_phase" });

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

    res.status(201).json({ message: "success_added_phase_to_program" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    res
      .status(error.statusCode)
      .json({ message: "error_to_add_phase_to_program" });
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
      res.status(500).json({ message: "error_program_not_found" });
      return res;
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "error_to_retrieve_program_to_be_deleted" });
  }

  // Delete the program.
  try {
    await program.destroy();
    res.status(200).json({ message: "success_program_deleted" });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return res
      .status(error.statusCode)
      .json({ message: "error_deleting_program" });
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
 * Updates an exisitng program and the sessions allocates to them.
 */
exports.updateProgram = [
  validateProgram,
  async (req: any, res: any, next: any) => {
    const programKey = req.params.programKey;
    const { name, description, duration, duration_unit, sessions } = req.body;
    let program;

    try {
      // Trouver le programme par sa clé unique
      program = await Program.findOne({ where: { key: programKey } });
      if (!program) {
        return res
          .status(404)
          .json({ message: "program_not_found", program: program.name });
      }
    } catch (error: any) {
      return res.status(500).json({ message: "error_searching_programs" });
    }

    try {
      const rawSessions = sessions || [];

      // Vérification que les sessions sont bien dans un format tableau
      const validSessions = Array.isArray(rawSessions) ? rawSessions : [];
      const filteredSessions = validSessions.filter(
        (session) => session !== "undefined" && session !== null
      );

      if (!filteredSessions.length) {
        return res.status(400).json({ message: "error_no_valid_session" });
      }

      let imagePath = "";

      if (req.file) {
        imagePath = `/images/${req.file.filename}`;
      } else {
        return res.status(400).json({ message: "error_no_image_provided" });
      }

      // Mise à jour des informations du programme
      await Program.update(
        {
          name,
          description,
          duration,
          duration_unit,
          image: imagePath,
          updatedAt: new Date(),
        },
        {
          where: { key: programKey },
        }
      );

      // Mettre à jour les sessions existantes
      if (filteredSessions && filteredSessions.length > 0) {
        if (!program?.id) {
          console.error("error_program_id_undefined");
          return res
            .status(400)
            .json({ message: "error_program_id_undefined" });
        }

        try {
          // Récupérer toutes les sessions actuelles liées à ce programme
          const existingSessions: { sessionId: number }[] =
            await ProgramSession.findAll({
              where: { programId: program.id },
            });

          // Extraire uniquement les sessionId existants
          const existingSessionIds = existingSessions.map(
            (session) => session.sessionId
          );

          // Identifier les sessions à SUPPRIMER (celles qui ne sont plus sélectionnées)
          const sessionsToDelete = existingSessionIds.filter(
            (id) => !filteredSessions.includes(id)
          );

          // Supprimer les sessions non sélectionnées
          if (sessionsToDelete.length > 0) {
            await ProgramSession.destroy({
              where: {
                programId: program.id,
                sessionId: sessionsToDelete,
              },
            });
          }

          // Traiter les sessions sélectionnées (ajout/mise à jour)
          for (const sessionId of filteredSessions) {
            const existingSession = await ProgramSession.findOne({
              where: { programId: program.id, sessionId },
            });

            if (existingSession) {
              // Mettre à jour la session existante (ajoute d'autres champs si nécessaire)
              await ProgramSession.update(
                { sessionId },
                { where: { programId: program.id, sessionId } }
              );
            } else {
              // Créer la session si elle n'existe pas
              await ProgramSession.create({ programId: program.id, sessionId });
            }
          }
        } catch (error) {
          console.error("Error updating sessions:", error);
          return res.status(500).json({ message: "internal_server_error" });
        }
      }

      res.status(200).json({ message: "success_program_updated" });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "error_updating_program" });
    }
    return res;
  },
];

/**
 * Get session associate to a program
 */

exports.getSessionsByProgram = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;

    // Récupérer les sessions associées au programme
    const sessions = await ProgramSession.findAll({
      where: { programId: id },
      attributes: ["sessionId"],
    });

    res.json(sessions.map((ps: { sessionId: number }) => ps.sessionId));
  } catch (error) {
    res.status(500).json({ message: "error_retrieving_sessions" });
  }
};

/**
 * Get a program details with associate sessions
 */

exports.getProgramDetails = async (req: any, res: any, next: any) => {
  try {
    const programId = req.params.key;

    // Récupérer le programme avec ses sessions associées
    const program = await Program.findByPk(programId, {
      include: {
        model: Session,
        through: { attributes: [] },
      },
    });

    if (!program) {
      return res.status(404).json({ message: "error_no_program_found" });
    }

    res.json(program);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal_server_error" });
  }
};

/**
 * Search program by key words
 */
interface ProgramFilters {
  id?: number;
  name?: string;
  duration?: number;
  duration_unit?: "days" | "weeks";
  description_keywords?: string;
}

// Utiliser ce type dans la fonction
export const searchPrograms = async (req: any, res: any, next: any) => {
  try {
    const filters = req.query as ProgramFilters;

    const whereClause: any = {}; // Clause de recherche

    // Recherche par id
    if (filters.id) {
      whereClause.id = filters.id;
    }

    // Recherche par nom
    if (filters.name) {
      whereClause.name = {
        [Op.iLike]: `%${filters.name}%`,
      };
    }

    // Recherche par durée et unité de durée
    if (filters.duration && filters.duration_unit) {
      whereClause.duration = filters.duration;
      whereClause.duration_unit = filters.duration_unit;
    }

    // Recherche uniquement par durée
    if (filters.duration && !filters.duration_unit) {
      whereClause.duration = filters.duration;
    }

    // Recherche uniquement par unité de durée
    if (!filters.duration && filters.duration_unit) {
      whereClause.duration_unit = filters.duration_unit;
    }

    // Recherche par mots-clés dans la description
    if (filters.description_keywords) {
      whereClause.description = {
        [Op.iLike]: `%${filters.description_keywords}%`,
      };
    }

    // Exécution de la requête de recherche
    const programs = await Program.findAll({
      where: whereClause,
    });

    // Si aucun programme n'est trouvé
    if (programs.length === 0) {
      return res.status(404).json({ message: "error_no_program_found" });
    }

    // Retourner les programmes trouvés
    res.json(programs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error_searching_programs" });
  }
};

exports.toggleProgramActivation = async (req: any, res: any) => {
  const programKey = req.params.programKey;
  const { actif } = req.body; // true pour activer, false pour désactiver

  try {
    const program = await Program.findOne({ where: { key: programKey } });

    if (!program) {
      return res.status(404).json({ message: "error_no_program_found" });
    }

    await program.update({ actif });

    const action = actif ? "enabled" : "disabled";
    res.status(200).json({ message: `program_action.${action}` });
  } catch (error: any) {
    res.status(500).json({ message: "error_program_enable_disable" });
  }
};

exports.getProgramsByPatientId = async (req: any, res: any) => {
  const patientId = req.params.patientId;

  // First, get all enrollments for this patient
  const patientEnrollments = await ProgramEnrollement.findAll({
    where: { PatientId: patientId },
  });

  // Extract program IDs from enrollments
  const programIds = patientEnrollments.map(
    (enrollment: typeof ProgramEnrollement) => enrollment.ProgramId
  );

  // Then get the programs that match these IDs
  const patientPrograms = await Program.findAll({
    where: { id: programIds },
  });

  return res.json(patientPrograms);
};
