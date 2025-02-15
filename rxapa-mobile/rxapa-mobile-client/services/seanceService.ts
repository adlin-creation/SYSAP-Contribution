// Objective: Seance service to handle all the requests related to the Seance.
// Objective: Service de séance pour gérer toutes les requêtes liées à la séance.-
import { API_CONFIG } from '../config/api';

class SeanceService {
  /**
   * Récupérer les exercices liés à un `ProgramEnrollementId`
   */
  static async getExercisesByProgramEnrollementId(programEnrollementId: number) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/sessions/exercises-by-program?programEnrollementId=${programEnrollementId}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des exercices.');
      }
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Erreur dans SeanceService:', error);
      return { success: false, message: 'Une erreur est survenue lors de la récupération des exercices.' };
    }
  }
}

export default SeanceService;
