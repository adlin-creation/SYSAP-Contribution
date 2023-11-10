import { Request, Response } from 'express';
import Program from '../models/Program';

class ProgramController {
  static getAllPrograms(req: Request, res: Response): void {
    Program.findAll()
      .then((programs) => {
        res.json(programs);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      });
  }

  static getProgramById(req: Request, res: Response): void {
    const { id } = req.params;

    Program.findByPk(id)
      .then((program) => {
        if (!program) {
          res.status(404).json({ error: 'Program not found' });
        } else {
          res.json(program);
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      });
  }

  static createProgram(req: Request, res: Response): void {
    const { ProgramName, ProgramDescription, ProgramDuration } = req.body;

    Program.create({
      ProgramName,
      ProgramDescription,
      ProgramDuration,
    })
      .then((program) => {
        res.status(201).json(program);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      });
  }

  static updateProgramById(req: Request, res: Response): void {
    const { id } = req.params;
    const { ProgramName, ProgramDescription, ProgramDuration } = req.body;

    Program.findByPk(id)
      .then((program) => {
        if (!program) {
          res.status(404).json({ error: 'Program not found' });
        } else {
          program.ProgramName = ProgramName;
          program.ProgramDescription = ProgramDescription;
          program.ProgramDuration = ProgramDuration;

          program.save()
            .then((updatedProgram) => {
              res.json(updatedProgram);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json({ error: 'Internal server error' });
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      });
  }

  static deleteProgramById(req: Request, res: Response): void {
    const { id } = req.params;

    Program.findByPk(id)
      .then((program) => {
        if (!program) {
          res.status(404).json({ error: 'Program not found' });
        } else {
          program.destroy()
            .then(() => {
              res.status(204).send();
            })
            .catch((error) => {
              console.error(error);
              res.status(500).json({ error: 'Internal server error' });
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      });
  }
}

export default ProgramController;
