// objective: Implement the logic to fetch patient statistics filtered by day, week, or all time.
// objective: Implémenter la logique pour récupérer les statistiques du patient filtrées par jour, semaine ou tout le temps.
import { Request, Response } from 'express';
import { dbClient } from '../database';

class PatientStatisticsController {
  /**
   * Fetch patient statistics filtered by day, week, or all time.
   */
  public static async getPatientStatistics(req: Request, res: Response) {
    try {
      const programEnrollmentId = parseInt(req.query.ProgramEnrollementId as string, 10);
      const filterType = (req.query.filterType as string)?.trim() || 'all'; // Default filter: all

      console.log('Received parameters:', { programEnrollmentId, filterType });

      // Validate ProgramEnrollementId
      if (isNaN(programEnrollmentId)) {
        return res.status(400).json({
          success: false,
          message: 'Un ID valide pour l\'enregistrement du programme est requis.',
        });
      }

      // Validate filterType
      if (!['day', 'week', 'all'].includes(filterType)) {
        return res.status(400).json({
          success: false,
          message: 'filterType doit être "day", "week" ou "all".',
        });
      }

      let query = '';
      const params = [programEnrollmentId];

      // Construct SQL query based on the filter
      if (filterType === 'day') {
        query = `
          SELECT 
            "date",
            AVG(COALESCE("difficultyLevel", 0)) AS "avgDifficulty",
            AVG(COALESCE("painLevel", 0)) AS "avgPainLevel",
            SUM(COALESCE("walkingTime", 0)) AS "totalWalkingTime",
            SUM(COALESCE("accomplishedExercice", 0)) AS "totalExercises",
            AVG(CASE
                  WHEN CAST("satisfactionLevel" AS TEXT) ~ '^\d+$' THEN CAST("satisfactionLevel" AS INTEGER)
                  ELSE 0
                END) AS "avgSatisfactionLevel",
            COUNT(*) AS "sessionCount"
          FROM public."SessionRecords"
          WHERE "ProgramEnrollementId" = $1
          GROUP BY "date"
          ORDER BY "date" ASC;
        `;
      } else if (filterType === 'week') {
        query = `
         SELECT
             DATE_TRUNC('week', "date") AS "weekStartDate",
            AVG(COALESCE("difficultyLevel", 0)) AS "avgDifficulty",
            AVG(COALESCE("painLevel", 0)) AS "avgPainLevel",
            SUM(COALESCE("walkingTime", 0)) AS "totalWalkingTime",
            SUM(COALESCE("accomplishedExercice", 0)) AS "totalExercises",
            AVG(COALESCE("satisfactionLevel", 0)) AS "avgSatisfactionLevel",
            COUNT(*) AS "sessionCount"
            FROM public."SessionRecords"
            WHERE "ProgramEnrollementId" = $1
            GROUP BY DATE_TRUNC('week', "date")
            ORDER BY "weekStartDate" ASC;
        `;
      } else if (filterType === 'all') {
        query = `
          SELECT 
            MIN("date") AS "startDate",
            MAX("date") AS "endDate",
            AVG(COALESCE("difficultyLevel", 0)) AS "avgDifficulty",
            AVG(COALESCE("painLevel", 0)) AS "avgPainLevel",
            SUM(COALESCE("walkingTime", 0)) AS "totalWalkingTime",
            SUM(COALESCE("accomplishedExercice", 0)) AS "totalExercises",
            AVG(COALESCE("satisfactionLevel", 0)) AS "avgSatisfactionLevel",
            COUNT(*) AS "sessionCount"
          FROM public."SessionRecords"
          WHERE "ProgramEnrollementId" = $1;
        `;
      }

      console.log('Generated SQL query:', query);
      console.log('Query parameters:', params);

      // Execute the query
      const result = await dbClient.query(query, params);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Aucune session trouvée pour cet utilisateur.',
        });
      }

      console.log('Query results:', result.rows);

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques patient:', err);
      return res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur.',
      });
    }
  }
}

export { PatientStatisticsController };
