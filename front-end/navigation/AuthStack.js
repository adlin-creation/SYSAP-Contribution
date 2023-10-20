import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import OnboardingScreen from '../screens/Onboarding';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;