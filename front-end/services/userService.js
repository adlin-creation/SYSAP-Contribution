import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export async function getUserFromToken() {
  try {
    const token = await AsyncStorage.getItem('userToken');

    if (token) {
      const secretKey = 'SuperSecret';

      const decoded = jwtDecode(token, secretKey);

      return decoded.user;
    } else {
      console.error('User token not found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving or decoding user token:', error);
    return null;
  }
}

