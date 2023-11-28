import { Request, Response } from 'express';
import { getISOWeek } from 'date-fns';
import ProgressionMarches from "../models/ProgressionMarches";
import ProgressionExercices from "../models/ProgressionExerices";

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

    static async updateProgressionMarche(req: Request, res: Response): Promise<void> {
        try {
            const {idPatient, Marche} = req.body;

            const currentWeek = getISOWeek(new Date());
            const progressionMarche = await ProgressionMarches.findOne({
                where: { idPatient,
                        NbSemaines: currentWeek
                },
            });

            if (!progressionMarche) {
                const newProgressionMarche = await ProgressionMarches.create({
                    idPatient,
                    NbSemaines: currentWeek,
                    Marche: Marche,
                    NbMarches: 1,
                });

                res.status(201).json({ success: true, message: 'Marche ajoutée avec succès.', data: newProgressionMarche });
                return;
            }
            await progressionMarche.update({
                NbSemaines: currentWeek,
                Marche: progressionMarche.Marche + Marche,
                NbMarches: ++progressionMarche.NbMarches,
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
            const { idPatient, DiffMoyenne, NbObjectifs, NumProgramme } = req.body;


            const currentWeek = getISOWeek(new Date());
            const progressionExercices = await ProgressionExercices.findOne({
                where: { idPatient,
                    NbSemaines: currentWeek
                },
            });

            // Creer si non existant
            if (!progressionExercices) {
                const newProgressionExercice = await ProgressionExercices.create({
                    idPatient,
                    NbSeances: 1,
                    DiffMoyenne: DiffMoyenne,
                    NbSemaines: currentWeek,
                    NbObjectifs: NbObjectifs,
                    NumProgramme: NumProgramme,
                });

                res.status(201).json({ success: true, message: 'Exercices ajoutée avec succès.', data: newProgressionExercice });
                return;
            }

            // maj
            await progressionExercices.update({
                NbSeances: ++progressionExercices.NbSeances,
                DiffMoyenne: (DiffMoyenne + progressionExercices.DiffMoyenne)/(progressionExercices.NbSeances),
                NbSemaines: currentWeek,
                NbObjectifs: NbObjectifs,
                NumProgramme: NumProgramme,
            });

            res.status(200).json({ success: true, message: 'Progression mise à jour.' });
        } catch (error) {
            console.error('Erreur mise à jour de la Progression :', error);
            res.status(500).json({ success: false, message: 'Erreur mise à jour de la Progression.' + error});
        }
    }
    static async getProgressionMarche(req: Request, res: Response): Promise<void> {
        try {
            const idPatient = parseInt(req.params.idPatient, 10);
            const currentWeek = getISOWeek(new Date());
            const semaine = req.params.week || currentWeek;

            let progressionMarche = await ProgressionMarches.findOne({
                where: { idPatient, NbSemaines: semaine },
            });

            if (!progressionMarche) {
                res.status(404).json({succes: false, message: 'Id introuvable ou semaine non valide'});
                return;
            }

            res.status(200).json({ success: true, data: progressionMarche });
        } catch (error) {
            console.error('Erreur récupération progression marche :', error);
            res.status(500).json({ success: false, message: 'Erreur récupération de la progression de marche.' });
        }
    }

    static async getProgressionExercice(req: Request, res: Response): Promise<void> {
        try {
            const idPatient = parseInt(req.params.idPatient, 10);
            const currentWeek = getISOWeek(new Date());
            const semaine = req.params.week || currentWeek;

            let progressionExercices = await ProgressionExercices.findOne({
                where: { idPatient, NbSemaines: semaine },
            });

            if (!progressionExercices) {
                res.status(404).json({succes: false, message: 'Id introuvable ou semaine non valide'});
                return;
            }

            res.status(200).json({ success: true, data: progressionExercices });
        } catch (error) {
            console.error('Erreur récupération progression marche :', error);
            res.status(500).json({ success: false, message: 'Erreur récupération de la progression de exercice.' });
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
    static async deleteAllMarche(req: Request, res: Response): Promise<void> {
        try {
            // Supprime toutes les entrées de la table ProgressionMarches
            await ProgressionMarches.destroy({
                where: {}, // Condition vide pour supprimer toutes les entrées
            });

            res.status(200).json({ message: 'Toutes les entrées ont été supprimées avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la suppression des entrées :', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression des entrées.' });
        }
    }
    static async deleteAllExercices(req: Request, res: Response): Promise<void> {
        try {
            // Supprime toutes les entrées de la table ProgressionMarches
            await ProgressionExercices.destroy({
                where: {}, // Condition vide pour supprimer toutes les entrées
            });

            res.status(200).json({ message: 'Toutes les entrées ont été supprimées avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la suppression des entrées :', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression des entrées.' });
        }
    }
}