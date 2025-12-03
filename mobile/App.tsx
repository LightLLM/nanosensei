/**
 * NanoSensei Mobile App Entry Point
 * 
 * On-device AI skill coach optimized for Arm-based mobile devices
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}

