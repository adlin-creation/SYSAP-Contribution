import { Exercise } from "../model/Exercise";
import { Session } from "../model/Session";
import { ExerciseVersion } from "../model/ExerciseVersion";
import { Program } from "../model/Program";
import { ProgramPhase } from "../model/ProgramPhase";
import { Variant } from "../model/Variant";
import { ProgramPhase_Program } from "../model/ProgramPhase_Program";
import { validateProgram } from "../middleware/validateProgram";
import { ProgramSession } from "../model/ProgramSession";
import fs from "fs";
import { Op } from "sequelize";

exports.createProgram = [
  validateProgram,
  async (req: any, res: any, next: any) => {
    const { name, description, duration, duration_unit, imageUrl } = req.body;
    const rawSessions = req.body.sessions;
    const sessions = Array.isArray(rawSessions) ? rawSessions : [];

    if (!sessions.length) {
      return res.status(400).json({ message: "Backend:error_no_valid_session" });
    }

    let imagePath = "";

    if (req.file) {
      imagePath = `/images/${req.file.filename}`;
    } else if (imageUrl) {
      imagePath = imageUrl;
    } else {
      return res.status(400).json({ message: "Backend:error_no_image_provided" });
    }

    try {
      const program = await Program.create({
        name,
        description,
        duration,
        duration_unit,
        image: imagePath,
      });

      for (const sessionId of sessions) {
        await ProgramSession.create({
          programId: program.id,
          sessionId,
        });
      }

      res.status(201).json({ message: "Backend:success_program_created" });
    } catch (error: any) {
      if (!error.statusCode) error.statusCode = 500;
      res.status(error.statusCode).json({ message: "Backend:error_program_creation_failed" });
    }
    return res;
  },
];

exports.getPrograms = async (req: any, res: any, next: any) => {
  try {
    const programs = await Program.findAll();
    res.status(200).json(programs);
  } catch (error: any) {
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).json({ message: "Backend:error_loading_programs" });
  }
  return res;
};

exports.getProgramPhases = async (req: any, res: any, next: any) => {
  const programKey = req.params.programKey;

  try {
    const program = await Program.findOne({ where: { key: programKey } });

    const programPhases = await program.getProgramPhase_Programs({
      order: [["rank", "ASC"]],
      include: { model: ProgramPhase },
    });

    res.status(200).json(programPhases);
  } catch (error: any) {
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).json({ message: "Backend:error_loading_program_phases" });
  }
  return res;
};

exports.getProgram = async (req: any, res: any, next: any) => {
  const programKey: string = req.params.programKey;
  try {
    const program = await Program.findOne({
      where: { key: programKey },
      include: [
        {
          model: ProgramPhase_Program,
          include: [{ model: ProgramPhase }],
        },
      ],
    });
    res.status(200).json(program);
  } catch (error: any) {
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).json({ message: "Backend:error_loading_program" });
  }
  return res;
};

exports.addProgramPhase = async (req: any, res: any, next: any) => {
  const programKey = req.params.programKey;
  const phaseName = req.body.phaseName;

  try {
    const program = await Program.findOne({ where: { key: programKey } });

    if (!program) {
      return res.status(404).json({ message: "Backend:error_program_not_found" });
    }

    const phase = await ProgramPhase.findOne({ where: { name: phaseName } });

    if (!phase) {
      return res.status(404).json({ message: "Backend:error_phase_not_found" });
    }

    const rank = (await program.countProgramPhase_Programs()) + 1;

    await ProgramPhase_Program.create({
      ProgramId: program.id,
      ProgramPhaseId: phase.id,
      rank,
    });

    res.status(201).json({ message: "Backend:success_phase_added" });
  } catch (error: any) {
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).json({ message: "Backend:error_adding_phase" });
  }

  return res;
};

exports.deleteProgram = async (req: any, res: any) => {
  const programKey = req.params.programKey;

  try {
    const program = await Program.findOne({ where: { key: programKey } });

    if (!program) {
      return res.status(404).json({ message: "Backend:error_program_not_found" });
    }

    await program.destroy();
    res.status(200).json({ message: "Backend:success_program_deleted" });
  } catch (error: any) {
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).json({ message: "Backend:error_deleting_program" });
  }

  return res;
};

exports.updateProgram = async (req: any, res: any, next: any) => {
  const programKey = req.params.programKey;
  const { name, description, duration } = req.body;

  try {
    const program = await Program.findOne({ where: { key: programKey } });

    if (!program) {
      return res.status(404).json({ message: "Backend:error_program_not_found" });
    }

    await program.update({ name, description, duration });

    res.status(200).json({ message: "Backend:success_program_updated" });
  } catch (error: any) {
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).json({ message: "Backend:error_updating_program" });
  }

  return res;
};

export const searchPrograms = async (req: any, res: any, next: any) => {
  try {
    const filters = req.query as {
      id?: number;
      name?: string;
      duration?: number;
      duration_unit?: "days" | "weeks";
      description_keywords?: string;
    };

    const whereClause: any = {};

    if (filters.id) whereClause.id = filters.id;

    if (filters.name) {
      whereClause.name = { [Op.iLike]: `%${filters.name}%` };
    }

    if (filters.duration) whereClause.duration = filters.duration;
    if (filters.duration_unit) whereClause.duration_unit = filters.duration_unit;

    if (filters.description_keywords) {
      whereClause.description = {
        [Op.iLike]: `%${filters.description_keywords}%`,
      };
    }

    const programs = await Program.findAll({ where: whereClause });

    if (programs.length === 0) {
      return res.status(404).json({ message: "Backend:error_no_program_found" });
    }

    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: "Backend:error_searching_programs" });
  }
};
