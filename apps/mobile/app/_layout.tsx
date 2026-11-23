import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@/src/theme';
import { ModeProvider } from '@/src/context/ModeContext';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const id = 'viajunto-focus-ring';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      [role="button"]:focus-visible,
      button:focus-visible,
      [role="tab"]:focus-visible,
      [role="checkbox"]:focus-visible,
      [tabindex="0"]:focus-visible,
      a:focus-visible {
        outline: 2px solid #1B4FA3 !important;
        outline-offset: 2px;
      }
      input:focus-visible,
      textarea:focus-visible {
        outline: 2px solid #1877F2 !important;
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <ModeProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'fade', animationDuration: 280 }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="loading" />
            <Stack.Screen name="acesso" />
            <Stack.Screen name="login" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="cadastro" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="buscar-carona" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="publicar-carona" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="carona/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="chat/[rideId]" options={{ animation: 'slide_from_right' }} />
          </Stack>
        </ModeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
