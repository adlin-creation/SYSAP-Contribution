//objective: This file contains the authentication service that will be used to authenticate the user with the server.
//objective: Ce fichier contient le service d'authentification qui sera utilisé pour authentifier l'utilisateur avec le serveur.
import axios from 'axios';
import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authenticate = async (code: string) => {
  try {
    const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}`, {
      programEnrollementCode: code,
    });

    console.log('Response data: ', response.data);

    if (response.data.success) {
      const programEnrollementId = response.data.data.programEnrollementId;
      if (!programEnrollementId) {
        throw new Error('ProgramEnrollementId missing in response');
      }
      await AsyncStorage.setItem('programEnrollementId', programEnrollementId.toString());
      return response.data;
    } else {
      return { success: false, message: 'error_invalid_code' };
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    return { success: false, message: 'error_network_or_server_error' };
  }
};

export default { authenticate };
