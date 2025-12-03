/**
 * App Navigation Setup
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SessionSetupScreen from '../screens/SessionSetupScreen';
import CameraSessionScreen from '../screens/CameraSessionScreen';
import ProgressScreen from '../screens/ProgressScreen';

export type RootStackParamList = {
  Home: undefined;
  SessionSetup: undefined;
  CameraSession: { skillType: string };
  Progress: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'NanoSensei' }}
        />
        <Stack.Screen
          name="SessionSetup"
          component={SessionSetupScreen}
          options={{ title: 'Setup Session' }}
        />
        <Stack.Screen
          name="CameraSession"
          component={CameraSessionScreen}
          options={{ title: 'Coaching Session' }}
        />
        <Stack.Screen
          name="Progress"
          component={ProgressScreen}
          options={{ title: 'Your Progress' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

