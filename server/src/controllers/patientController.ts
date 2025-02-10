import { Request, Response } from 'express';
import Patient from '../models/Patient';

// TODO: controllers with CRUD operations are subject to change, here now for testing
export default class PatientController {




    static async getAllPatients(req: Request, res: Response): Promise<void> {
        try {
            const patient = await Patient.findAll();

            res.status(200).json({ success: true, data: patient });
        } catch (error) {
            console.error('Erreur lors de la récupération de toutes les progressions de marche :', error);
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération de toutes les progressions de marche.' });
        }
    }
    static async addPatient(req: Request, res: Response): Promise<void> {
        try {
            const { idPatient, Name, FamilyName, Email, Password } = req.body;

            // Avoir verifier que tous les champs sont valides
            const patient1 = await Patient.create({
                idPatient, Name, FamilyName, Email, Password
            });

            res.status(201).json({ success: true, message: 'Marche ajoutée avec succès.', data: patient1 });
        } catch (error) {
            console.error('Erreur marche :', error);
            res.status(500).json({ success: false, message: 'Erreur marche.' + error});
        }
    }

    //
    // static getPatientById(req: Request, res: Response): void {
    //     const id = parseInt(req.params.id);
    //     Patient.getPatientById(id, (patient) => {
    //         if (patient) {
    //             res.json(patient);
    //         } else {
    //             res.status(404).json({ error: 'Patient not found' });
    //         }
    //     });
    // }
    //
    // static createPatient(req: Request, res: Response): void {
    //     const patient = new Patient(
    //         req.body.firstName,
    //         req.body.lastName,
    //         0 // Set an initial id of 0 or provide it if needed
    //     );
    //     Patient.createPatient(patient, (success) => {
    //         if (success) {
    //             res.status(201).json({ message: 'Patient created' });
    //         } else {
    //             res.status(500).json({ error: 'Failed to create patient' });
    //         }
    //     });
    // }
    //
    // static updatePatientById(req: Request, res: Response): void {
    //     const id = parseInt(req.params.id);
    //     const patient = new Patient(
    //         req.body.firstName,
    //         req.body.lastName,
    //         0 // Set an initial id of 0 or provide it if needed
    //     );
    //     Patient.updatePatientById(id, patient, (success) => {
    //         if (success) {
    //             res.json({ message: 'Patient updated' });
    //         } else {
    //             res.status(404).json({ error: 'Patient not found' });
    //         }
    //     });
    // }
    //
    // static deletePatientById(req: Request, res: Response): void {
    //     const id = parseInt(req.params.id);
    //     Patient.deletePatientById(id, (success) => {
    //         if (success) {
    //             res.json({ message: 'Patient deleted' });
    //         } else {
    //             res.status(404).json({ error: 'Patient not found' });
    //         }
    //     });
    // }

}
