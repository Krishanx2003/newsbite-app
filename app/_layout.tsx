import { NotificationProvider } from '@/context/NotificationProvider';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { UserActivityProvider } from '@/context/UserActivityContext';
// import { useColorScheme } from '@/hooks/use-color-scheme'; // Removed as we use ThemeContext
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // const colorScheme = useColorScheme(); // Removed

  return (
    <NotificationProvider>
      <UserActivityProvider>
        <ThemeProvider>
          {/* We can use the ThemeProvider from navigation if needed, or just rely on our custom one. 
              However, we need to pass the correct theme to Navigation Container for standard headers/etc. 
              But since we are inside app/_layout, the Stack manages that? 
              Actually, Stack is from expo-router. 
          */}
          <InnerLayout />
        </ThemeProvider>
      </UserActivityProvider>
    </NotificationProvider>
  );
}

function InnerLayout() {
  const { theme } = useTheme();
  const { DarkTheme, DefaultTheme, ThemeProvider: NavThemeProvider } = require('@react-navigation/native');

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
