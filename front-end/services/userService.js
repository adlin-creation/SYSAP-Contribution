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

export const getPatientsForCaregiver = async () => {
  try {
    const user = await getUserFromToken();
    
    const path = `/api/caregivers/${user.id}/patients`;
    
    if (user.role !== "caregiver"){
      throw new Error("User is not a caregiver");
    } 

    const data = await fetchServerData(path);

    return data.patients;
  } catch (error) {
    console.error('Error fetching patients for caregiver:', error);
    throw error;
  }
};

