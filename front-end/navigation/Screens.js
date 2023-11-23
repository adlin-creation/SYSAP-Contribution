import React from "react";

import { Dimensions } from "react-native";
import { Header, Icon } from "../components";
import { materialTheme } from "../constants/";

import CustomDrawerContent from "./Menu";
import AccueilScreen from "../screens/Accueil";
import OnboardingScreen from "../screens/Onboarding";
import ProfileScreen from "../screens/Profile";
import ProgrammeScreen from "../screens/Programme";
import ProgressionScreen from "../screens/Progression";
import SeanceScreen from "../screens/Seance";
import LoginScreen from "../screens/Login";
import RegisterScreen from "../screens/Register";
import ProgramChangeScreen from "../screens/ProgramChange";
import LogoutScreen from "../screens/Logout";
import ExerciseDetail from "../screens/ExerciseDetail";
import EvaluationScreen from "../screens/Evaluation";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { fetchServerData } from '../services/apiServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const profile = {
  id: "",
  name: "",
  familyName: "",
  email: "",
  programName: ""
};

async function updateProfile() {
  try {
    const userId = await AsyncStorage.getItem('userId');
    const data = await fetchServerData(`/api/programEnrollment/user/${userId}`);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  // Return the updated profile
  return profile;
}

updateProfile().then(data => {
  profile.name = `${data.patient.firstName} ${data.patient.lastName}`;
  profile.programName = data.program.name;
}).catch(error => {
  console.error('Error in updateProfile:', error);
});

function ProfileStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              white
              transparent
              title="Profile"
              scene={scene}
              navigation={navigation}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

function AccueilStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="AccueilScreen"
        component={AccueilScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              tabs
              title="Accueil"
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function ProgressionStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Progression"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="ProgressionScreen"
        component={ProgressionScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Progression" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function ProgrammeStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Programme"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="ProgrammeScreen"
        component={ProgrammeScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Programme" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function SeanceStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Séance"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="SeanceScreen"
        component={SeanceScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Séance" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function EvaluationStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Évaluation"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="EvaluationScreen"
        component={EvaluationScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header title="Évaluation" scene={scene} navigation={navigation} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} profile={profile} />
      )}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      screenOptions={{
        activeTintColor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: materialTheme.COLORS.ACTIVE,
        inactiveBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.74,
          paddingHorizontal: 12,
          // paddingVertical: 4,
          justifyContent: "center",
          alignContent: "center",
          // alignItems: 'center',
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          fontWeight: "normal",
        },
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Accueil"
        component={AccueilStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="shop"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Progression"
        component={ProgressionStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="md-switch"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginRight: 2, marginLeft: 2 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Programme"
        component={ProgrammeStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="gears"
              family="font-awesome"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
              style={{ marginRight: -3 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="circle-10"
              family="GalioExtra"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Séance"
        component={SeanceStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="heart"
              family="entypo"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Évaluation"
        component={EvaluationStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="heart"
              family="entypo"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Se connecter"
        component={ProgrammeScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="ios-log-in"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Se déconnecter"
        component={LogoutScreen}
        component={LogoutScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="md-person-add"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetail} />
      <Stack.Screen name="ProgramChange" component={ProgramChangeScreen} />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}

