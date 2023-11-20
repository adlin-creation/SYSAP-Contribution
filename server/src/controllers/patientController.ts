import { Request, Response } from 'express';
import { Patient } from '../models/Patient';

// TODO: controllers with CRUD operations are subject to change, here now for testing
export default class PatientController {
    static getAllPatients(req: Request, res: Response): void {
        Patient.getAllPatients((patients) => {
            res.json(patients);
        });
    }

    static getPatientById(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        Patient.getPatientById(id, (patient) => {
            if (patient) {
                res.json(patient);
            } else {
                res.status(404).json({ error: 'Patient not found' });
            }
        });
    }

    static createPatient(req: Request, res: Response): void {
        const patient = new Patient(
            req.body.firstName,
            req.body.lastName,
            0 // Set an initial id of 0 or provide it if needed
        );
        Patient.createPatient(patient, (success) => {
            if (success) {
                res.status(201).json({ message: 'Patient created' });
            } else {
                res.status(500).json({ error: 'Failed to create patient' });
            }
        });
    }

    static updatePatientById(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        const patient = new Patient(
            req.body.firstName,
            req.body.lastName,
            0 // Set an initial id of 0 or provide it if needed
        );
        Patient.updatePatientById(id, patient, (success) => {
            if (success) {
                res.json({ message: 'Patient updated' });
            } else {
                res.status(404).json({ error: 'Patient not found' });
            }
        });
    }

    static deletePatientById(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        Patient.deletePatientById(id, (success) => {
            if (success) {
                res.json({ message: 'Patient deleted' });
            } else {
                res.status(404).json({ error: 'Patient not found' });
            }
        });
    }
}
