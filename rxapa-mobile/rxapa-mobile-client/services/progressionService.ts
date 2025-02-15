// objective: Handle the requests to the API for the progression data
// objective: Gérer les requêtes à l'API pour les données de progression
import { API_CONFIG } from '../config/api';

export class ProgressionService {
  static async fetchProgressionData(programEnrollementId: number) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROGRESSION}?ProgramEnrollementId=${programEnrollementId}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des données');
      }
      return data;
    } catch (error) {
      console.error('Erreur dans ProgressionService:', error);
      throw error;
    }
  }

  static async fetchStatistics(programEnrollementId: number, filterType: 'day' | 'week' | 'all') {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STATISTICS}?ProgramEnrollementId=${programEnrollementId}&filterType=${filterType}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des statistiques');
      }
      return data;
    } catch (error) {
      console.error('Erreur dans ProgressionService:', error);
      throw error;
    }
  }
  static async fetchStatisticsByDates(programEnrollementId: number, startDate?: string, endDate?: string) {
    try {
      // Construct the URL with optional parameters
      const url = new URL(`${API_CONFIG.BASE_URL}/patient-statistics/details-by-dates`);
      url.searchParams.append('ProgramEnrollementId', programEnrollementId.toString());
      if (startDate) {
        url.searchParams.append('startDate', startDate);
      }
      if (endDate) {
        url.searchParams.append('endDate', endDate);
      }
  
      const response = await fetch(url.toString());
  
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la récupération des données');
        }
  
        return data;
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('La réponse du serveur n\'est pas au format JSON.');
      }
    } catch (error) {
      console.error('Erreur dans fetchStatisticsByDates:', error);
      throw error;
    }
  }
  
  
  
}
