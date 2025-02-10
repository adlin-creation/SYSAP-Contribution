import { Request, Response } from 'express';
import ProgramEnrollment from "../models/ProgramEnrollment";

export default class ImpressionController {
    // Fonction de test de connexion
    static testConnection(req: Request, res: Response): void {
        try {
            res.status(200).json({ success: true, message: 'Connexion réussie.' });
        } catch (error) {
            console.error('Erreur de connexion :', error);
            res.status(500).json({ success: false, message: 'Erreur de connexion.' });
        }
    }
    static async getProgram(req: Request, res: Response): Promise<void> {
        try {
            const patientId = req.params.patientId;
            const programme = await ProgramEnrollment.findAll({
                where: {
                    PatientId: patientId
                },
            });

            res.status(200).json({ success: true, data: programme });
        } catch (error) {
            console.error('Erreur lors de la récupération du programme. :', error);
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération du programme' });
        }
    }
}
