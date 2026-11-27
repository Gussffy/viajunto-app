import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MotionProvider } from './src/components/motion';
import { Application } from './src/navigation';

export default function App() {
  return <SafeAreaProvider><MotionProvider><Application /></MotionProvider></SafeAreaProvider>;
}
