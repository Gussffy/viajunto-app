import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '@/src/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'fade',
            animationDuration: 350,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="loading" />
          <Stack.Screen name="acesso" options={{ animation: 'fade', animationDuration: 450 }} />
          <Stack.Screen name="login" options={{ animation: 'slide_from_right', animationDuration: 320 }} />
          <Stack.Screen name="cadastro" options={{ animation: 'slide_from_right', animationDuration: 320 }} />
          <Stack.Screen name="home" options={{ animation: 'fade', animationDuration: 320 }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
