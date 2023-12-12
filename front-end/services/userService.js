import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchServerData } from './apiServices';
import { Buffer } from 'buffer';

export async function getUserFromToken() {
  try {
    const token = await AsyncStorage.getItem('userToken');

    if (token) {
      const parts = token.split('.').map((part) => Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'),'base64').toString());
      const user = JSON.parse(parts[1])

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

