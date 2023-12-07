import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUserFromToken() {
  try {
    const token = await AsyncStorage.getItem('userToken');

    if (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var tokenData = decodeURIComponent(window.atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const user = JSON.parse(tokenData).user;

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

