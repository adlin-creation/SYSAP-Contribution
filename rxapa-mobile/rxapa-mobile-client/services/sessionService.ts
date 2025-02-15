// Objective: Provide a service to create a session record in the database.// Path: services/sessionService.ts
// Objective: donner un service pour créer un enregistrement de session dans la base de données.
import axios from 'axios';
import { API_CONFIG } from '../config/api';

const createSessionRecord = async (sessionData: {
  ProgramEnrollementId: number;
  difficultyLevel: number;
  painLevel: number;
  satisfactionLevel: string;
  walkingTime: number;
  accomplishedExercice: string;
  SessionId: number;
}) => {
  try {
    // Log the constructed URL and session data for debugging
    console.log('URL:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SESSION_RECORD}`);
    console.log('Payload:', sessionData);

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SESSION_RECORD}`,
      sessionData
    );

    if (response.data.success) {
      console.log('Session record created successfully:', response.data.data);
      return {
        success: true,
        message: 'Session enregistrée avec succès',
        data: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data.message || 'Failed to create session record',
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error during session creation:', error.message);
      return { success: false, message: 'Network error: ' + error.message };
    } else if (error instanceof Error) {
      console.error('Error during session creation:', error.message);
      return { success: false, message: 'An error occurred: ' + error.message };
    } else {
      console.error('Unexpected error:', error);
      return { success: false, message: 'An unknown error occurred' };
    }
  }
};

export default {
  createSessionRecord,
};
