// objective: Gérer les requêtes liées aux sessions de suivi des utilisateurs
// objective: Handle requests related to user tracking sessions
import { Request, Response } from 'express';
import { dbClient } from '../database';
import { SessionRecord } from '../models/SessionRecord';

/**
 * Enregistrer une nouvelle session de suivi pour un utilisateur.
 */
export const createSessionRecord = async (req: Request, res: Response) => {
    try {
        console.log('Requête reçue avec les données suivantes :', req.body);

        const {
            ProgramEnrollementId,
            difficultyLevel,
            painLevel,
            satisfactionLevel = 'NotSpecified', // Valeur par défaut
            walkingTime,
            accomplishedExercice,
            SessionId,
        } = req.body;

        // Validation des champs requis
        if (!ProgramEnrollementId || !difficultyLevel || !painLevel || !walkingTime || !SessionId) {
            console.warn('Champs manquants ou invalides :', {
                ProgramEnrollementId,
                difficultyLevel,
                painLevel,
                walkingTime,
                SessionId,
            });
            return res.status(400).json({
                success: false,
                message: 'error_all_fields_required',
            });
        }

        // Requête SQL pour insérer la session
        const query = `
            INSERT INTO public."SessionRecords" (
                "ProgramEnrollementId", 
                "difficultyLevel", 
                "painLevel", 
                "satisfactionLevel", 
                "walkingTime", 
                "accomplishedExercice", 
                "SessionId", 
                "date"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            RETURNING *;
        `;

        const values = [
            ProgramEnrollementId,
            difficultyLevel,
            painLevel,
            satisfactionLevel,
            walkingTime,
            accomplishedExercice,
            SessionId,
        ];

        // Exécution de la requête
        const result = await dbClient.query(query, values);

        // Réponse avec les données insérées
        return res.status(201).json({
            success: true,
            message: 'success_session_recorded',
            data: result.rows[0],
        });
    } catch (err) {
        console.error('Erreur lors de l\'enregistrement de la session:', err);
        return res.status(500).json({
            success: false,
            message: 'error_internal_server_error',
        });
    }
};

/**
 * Récupérer toutes les sessions de suivi pour un utilisateur.
 */
export const getSessionRecords = async (req: Request, res: Response) => {
    try {
        const ProgramEnrollementId = parseInt(
            req.query.ProgramEnrollementId as string,
            10
        );

        if (isNaN(ProgramEnrollementId)) {
            console.warn('ID du programme manquant ou invalide.');
            return res.status(400).json({
                success: false,
                message: 'error_valid_enrollment_id_required',
            });
        }

        // Requête SQL pour récupérer les sessions
        const query = `
            SELECT * FROM public."SessionRecords"
            WHERE "ProgramEnrollementId" = $1
            ORDER BY "date" DESC;
        `;

        const values = [ProgramEnrollementId];

        // Exécution de la requête
        const result = await dbClient.query(query, values);

        if (result.rowCount === 0) {
            console.info('Aucune session trouvée pour l\'ID fourni.');
            return res.status(404).json({
                success: false,
                message: 'error_no_session_found_id',
            });
        }

        // Réponse avec les données récupérées
        return res.json({
            success: true,
            data: result.rows,
        });
    } catch (err) {
        console.error('Erreur lors de la récupération des sessions:', err);
        return res.status(500).json({
            success: false,
            message: 'error_internal_server_error',
        });
    }
};
