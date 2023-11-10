import { Request, Response } from 'express';
import Patient from '../models/Patient';

export default class PatientController {
    static getAllPatients(req: Request, res: Response): void {
        Patient.findAll()
          .then((patients) => {
            res.json(patients);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
          });
      }
    
      // Get a patient by ID
      static getPatientById(req: Request, res: Response): void {
        const { id } = req.params;
    
        Patient.findByPk(id)
          .then((patient) => {
            if (!patient) {
              res.status(404).json({ error: 'Patient not found' });
            } else {
              res.json(patient);
            }
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
          });
      }
}
