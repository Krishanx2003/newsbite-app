import { LockScreen } from '@/components/LockScreen';
import { NotificationProvider } from '@/context/NotificationProvider';
import { SecurityProvider, useSecurity } from '@/context/SecurityContext'; // Restored
import { ThemeProvider, useTheme } from '@/context/ThemeContext'; // Restored
import { UserActivityProvider } from '@/context/UserActivityContext'; // Restored
import { OnboardingProvider, useOnboarding } from '@/context/OnboardingContext';
import { Stack } from 'expo-router'; // Restored
import { StatusBar } from 'expo-status-bar'; // Restored
import React from 'react';
import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native'; // Restored

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <NotificationProvider>
      <UserActivityProvider>
        <OnboardingProvider>
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
        </OnboardingProvider>
      </UserActivityProvider>
    </NotificationProvider>
  );
}

import { Redirect } from 'expo-router';
import { AnimatedSplash } from '@/components/AnimatedSplash';
import { useState } from 'react';

function InnerLayout() {
  const { theme } = useTheme();
  const { isLocked } = useSecurity();
  const { hasSeenOnboarding, isLoading: isLoadingOnboarding } = useOnboarding();
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  // Show Splash until both data is loaded AND animation is finished
  if (isLoadingOnboarding || !isSplashFinished) {
    return <AnimatedSplash onFinish={() => setIsSplashFinished(true)} />;
  }

  // Once Splash is gone, check Security/Lock
  // Note: We might want Onboarding to bypass Lock? Usually Lock is for returning users.
  // If it's a fresh install (hass SeenOnboarding === false), maybe we shouldn't lock?
  // But logic below: if isLocked is true, it shows LockScreen.
  // Ideally, if (!hasSeenOnboarding), we skip lock check or ensure it's false.
  // But SecurityContext defaults to false unless 'app_lock_enabled' is true in storage.
  // A fresh install won't have 'app_lock_enabled', so isLocked should be false.

  if (isLocked) {
    return (
      <NavThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <LockScreen />
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </NavThemeProvider>
    );
  }

  // Main App
  return (
    <NavThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
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

      {/* Redirect to onboarding if not seen yet */}
      {!hasSeenOnboarding && <Redirect href="/onboarding" />}

      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}
