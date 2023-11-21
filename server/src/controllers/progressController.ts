import { Request, Response } from 'express';
import ProgressionMarches from "../models/ProgressionMarches";
import ProgressionExercices from "../models/ProgressionExerices";
import ProgressionExerices from "../models/ProgressionExerices";

export default class ProgressController {
    // Fonction de test de connexion
    static testConnection(req: Request, res: Response): void {
        try {
            res.status(200).json({ success: true, message: 'Connexion réussie.' });
        } catch (error) {
            console.error('Erreur de connexion :', error);
            res.status(500).json({ success: false, message: 'Erreur de connexion.' });
        }
    }

    // add row marche
    static async addProgressionMarche(req: Request, res: Response): Promise<void> {
        try {
            const { idPatient, NbSemaines, Marche, NbMarches } = req.body;

            // Avoir verifier que tous les champs sont valides
            const newProgressionMarche = await ProgressionMarches.create({
                idPatient,
                NbSemaines,
                Marche,
                NbMarches,
            });

            res.status(201).json({ success: true, message: 'Marche ajoutée avec succès.', data: newProgressionMarche });
        } catch (error) {
            console.error('Erreur marche :', error);
            res.status(500).json({ success: false, message: 'Erreur marche.' + error});
        }
    }

    static async addProgressionExercises(req: Request, res: Response): Promise<void> {
        try {
            const { idPatient, NbSeances, DiffMoyenne, NbSemaines, NbObjectifs, NumProgramme } = req.body;

            // Avoir verifier que tous les champs sont valides
            const newProgressionMarche = await ProgressionExerices.create({
                idPatient,
                NbSeances,
                DiffMoyenne,
                NbSemaines,
                NbObjectifs,
                NumProgramme,
            });

            res.status(201).json({ success: true, message: 'Progression Exercice ajoutée avec succès.', data: newProgressionMarche });
        } catch (error) {
            console.error('Erreur marche :', error);
            res.status(500).json({ success: false, message: 'Erreur Progression Exercice.' });
        }
    }
    // add row exercices

    // update marche
    static async updateProgressionMarche(req: Request, res: Response): Promise<void> {
        try {
            const { idPatient, NbSemaines, Marche, NbMarches } = req.body;

            // Avoir verifier que tous les champs sont valides

            // Rechercher progression
            const progressionMarche = await ProgressionMarches.findOne({
                where: { idPatient },
            });

            // Creer si non existant
            if (!progressionMarche) {
                await ProgressController.addProgressionMarche(req, res);
                return;
            }

            // maj
            await progressionMarche.update({
                NbSemaines: NbSemaines || progressionMarche.NbSemaines,
                Marche: Marche || progressionMarche.Marche,
                NbMarches: NbMarches || progressionMarche.NbMarches,
            });

            res.status(200).json({ success: true, message: 'Marche mise à jour.' });
        } catch (error) {
            console.error('Erreur mise à jour de la marche :', error);
            res.status(500).json({ success: false, message: 'Erreur mise à jour de la marche.' });
        }
    }
    // update exercices
    static async updateProgressionExercices(req: Request, res: Response): Promise<void> {
        try {
            const { idPatient, NbSeances, DiffMoyenne, NbSemaines, NbObjectifs, NumProgramme } = req.body;

            // Avoir verifier que tous les champs sont valides

            // Rechercher progression
            const progressionExercices = await ProgressionExercices.findOne({
                where: { idPatient },
            });

            // Creer si non existant
            if (!progressionExercices) {
                await ProgressController.addProgressionMarche(req, res);
                return;
            }

            // maj
            await progressionExercices.update({
                NbSeances: NbSeances || progressionExercices.NbSeances,
                DiffMoyenne: DiffMoyenne || progressionExercices.DiffMoyenne,
                NbSemaines: NbSemaines || progressionExercices.NbSemaines,
                NbObjectifs: NbObjectifs || progressionExercices.NbObjectifs,
                NumProgramme: NumProgramme || progressionExercices.NumProgramme,
            });

            res.status(200).json({ success: true, message: 'Progression mise à jour.' });
        } catch (error) {
            console.error('Erreur mise à jour de la Progression :', error);
            res.status(500).json({ success: false, message: 'Erreur mise à jour de la Progression.' });
        }
    }
    static async getProgressionMarche(req: Request, res: Response): Promise<void> {
        try {
            const idPatient = parseInt(req.params.idPatient, 10);

            // Recherchez la progression de marche pour le patient spécifié
            const progressionMarche = await ProgressionMarches.findOne({
                where: { idPatient },
            });

            res.status(200).json({ success: true, data: progressionMarche });
        } catch (error) {
            console.error('Erreur récupération progression marche :', error);
            res.status(500).json({ success: false, message: 'Erreur récupération de la progression de marche.' });
        }
    }

    static async getProgressionExercice(req: Request, res: Response): Promise<void> {
        try {
            const idPatient = parseInt(req.params.idPatient, 10);

            // Recherchez la progression de marche pour le patient spécifié
            const progressionExercices = await ProgressionExercices.findOne({
                where: { idPatient },
            });

            res.status(200).json({ success: true, data: progressionExercices });
        } catch (error) {
            console.error('Erreur récupération progression exercices :', error);
            res.status(500).json({ success: false, message: 'Erreur récupération de la progression Exercices.' });
        }
    }

    static async getAllMarche(req: Request, res: Response): Promise<void> {
        try {
            const allProgressions = await ProgressionMarches.findAll();

            res.status(200).json({ success: true, data: allProgressions });
        } catch (error) {
            console.error('Erreur lors de la récupération de toutes les progressions de marche :', error);
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération de toutes les progressions de marche.' });
        }
    }

    static async getAllExercices(req: Request, res: Response): Promise<void> {
        try {
            const allProgressions = await ProgressionExercices.findAll();

            res.status(200).json({ success: true, data: allProgressions });
        } catch (error) {
            console.error('Erreur récupération toutes progressions d\'exercices :', error);
            res.status(500).json({ success: false, message: 'Erreur lors de la récupération de toutes les progressions d\'exercices.' });
        }
    }

}

