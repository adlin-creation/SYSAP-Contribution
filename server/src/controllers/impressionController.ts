import { Request, Response } from 'express';

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
}
