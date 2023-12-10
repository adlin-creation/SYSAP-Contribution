import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
import { fetchServerData } from './apiServices'; // Adjust the path as needed

export async function getUserFromToken() {
  try {
    const token = await AsyncStorage.getItem('userToken');

    if (token) {
      const decoded = base64.decode(token.split('.')[1]).toString();
      const cleanedJsonString = decoded.replace(/[^\x20-\x7E]/g, '');
      const user =  JSON.parse(cleanedJsonString)

      return user;
    } else {
      console.error('User token not found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving or decoding user token:', error);
    return null;
  }
}

export const getPatientsForCaregiver = async (caregiverId) => {
  try {
    const path = `/api/caregivers/${caregiverId}/patients`;
    const data = await fetchServerData(path);
    return data.patients;
  } catch (error) {
    console.error('Error fetching patients for caregiver:', error);
    throw error;
  }
};

