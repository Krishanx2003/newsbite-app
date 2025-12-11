import { LockScreen } from '@/components/LockScreen';
import { NotificationProvider } from '@/context/NotificationProvider';
import { SecurityProvider, useSecurity } from '@/context/SecurityContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { UserActivityProvider } from '@/context/UserActivityContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <NotificationProvider>
      <UserActivityProvider>
        <SecurityProvider>
          <ThemeProvider>
            {/* We can use the ThemeProvider from navigation if needed, or just rely on our custom one. 
                However, we need to pass the correct theme to Navigation Container for standard headers/etc. 
                But since we are inside app/_layout, the Stack manages that? 
                Actually, Stack is from expo-router. 
            */}
            <InnerLayout />
          </ThemeProvider>
        </SecurityProvider>
      </UserActivityProvider>
    </NotificationProvider>
  );
}

function InnerLayout() {
  const { theme } = useTheme();
  const { isLocked } = useSecurity();

  if (isLocked) {
    return (
      <NavThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <LockScreen />
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </NavThemeProvider>
    );
  }

  return (
    <NavThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="news-customization"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen name="privacy" options={{ headerShown: false }} />
        <Stack.Screen name="terms" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ headerShown: false }} />
        <Stack.Screen name="contact" options={{ headerShown: false }} />
        <Stack.Screen name="saved" options={{ headerShown: false }} />
        <Stack.Screen name="history" options={{ headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}
