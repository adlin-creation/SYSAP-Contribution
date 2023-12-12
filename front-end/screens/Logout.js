import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

const LogoutScreen = ({ navigation }) => {
  useEffect(() => {
    // Remove userToken and programName from AsyncStorage
    const removeAsyncData = async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('programName');
      } catch (error) {
        console.error('Error removing data from AsyncStorage:', error);
      }
    };

    removeAsyncData().then(() => {
      // Navigate to the login screen
      navigation.replace('Login');
    });
  }, [navigation]);

  return (
    <View>
      <Text>Logging out...</Text>
    </View>
  );
};

export default LogoutScreen;