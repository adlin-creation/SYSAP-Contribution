import { Request, Response } from 'express';
import db from '../db/db-access';

// TODO: controllers with CRUD operations are subject to change, here now for testing
export default class ProgramController {
  static async getAllPrograms(req: Request, res: Response): Promise<void> {
    try {
      db.all('SELECT * FROM Program', (err: Error | null, programs: any[]) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.json(programs);
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  static async getProgramById(req: Request, res: Response): Promise<void> {
    const programId = req.params.id;
    try {
      db.get('SELECT * FROM Program WHERE idProgram = ?', [programId], (err: Error | null, program: any) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else if (!program) {
          res.status(404).send('Program not found');
        } else {
          res.json(program);
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}
