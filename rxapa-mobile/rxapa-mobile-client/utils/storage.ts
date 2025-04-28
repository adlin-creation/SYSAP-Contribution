//objective: To store the program enrollment id in the local storage of the device.
//objective: Pour stocker l'identifiant d'inscription au programme dans le stockage local de l'appareil.
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveProgramEnrollementId = async (id: number) => {
  try {
    await AsyncStorage.setItem('programEnrollementId', id.toString());
  } catch (error) {
    console.error('Error saving ProgramEnrollementId:', error);
  }
};

export const getProgramEnrollementId = async (): Promise<number | null> => {
  try {
    const id = await AsyncStorage.getItem('programEnrollementId');
    return id ? parseInt(id, 10) : null;
  } catch (error) {
    console.error('Error retrieving ProgramEnrollementId:', error);
    return null;
  }
};

export const clearProgramEnrollementId = async () => {
  try {
    await AsyncStorage.removeItem('programEnrollementId');
  } catch (error) {
    console.error('Error clearing ProgramEnrollementId:', error);
  }
};
