// objective: Gérer les requêtes liées aux sessions
// // objective: Handle requests related to sessions
import { Request, Response } from 'express';
import { dbClient } from '../database'; // Importation du client de base de données

class SessionController {
  /**
   * Récupérer les exercices liés à un ProgramEnrollementId
   */
  public static async getExercisesByProgramEnrollementId(req: Request, res: Response) {
    const { programEnrollementId } = req.query;

    if (!programEnrollementId) {
      return res.status(400).json({ success: false, message: 'ProgramEnrollementId est requis' });
    }

    try {
      // Trouver la session liée au ProgramEnrollementId
      const sessionQuery = `
        SELECT s.id
        FROM public."Sessions" s
        JOIN public."SessionRecords" sr ON sr."SessionId" = s.id
        WHERE sr."ProgramEnrollementId" = $1
        ORDER BY sr."date" DESC
        LIMIT 1;
      `;
      const sessionResult = await dbClient.query(sessionQuery, [programEnrollementId]);

      if (sessionResult.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Aucune session trouvée.' });
      }

      const sessionId = sessionResult.rows[0].id;

      // Récupérer les exercices associés
      const exercisesQuery = `
        SELECT eb.*, e.name AS "exerciseName", e.description AS "exerciseDescription",
               e."instructionalVideo", e."imageUrl"
        FROM public."Exercise_Blocs" eb
        JOIN public."Exercises" e ON e.id = eb."ExerciseId"
        JOIN public."Bloc_Sessions" bs ON bs."BlocId" = eb."BlocId"
        WHERE bs."SessionId" = $1;
      `;
      const exercisesResult = await dbClient.query(exercisesQuery, [sessionId]);

      if (exercisesResult.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Aucun exercice trouvé pour cette session.' });
      }

      res.status(200).json({ success: true, data: exercisesResult.rows }); // Retourne les exercices
    } catch (error) {
      console.error('Erreur lors de la récupération des exercices :', error);
      res.status(500).json({ success: false, message: 'Erreur du serveur.' });
    }
  }
}

export { SessionController };
