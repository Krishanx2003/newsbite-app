// app/(tabs)/_layout.tsx
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const systemColorScheme = useColorScheme(); // 'light' | 'dark' | null
  const [userTheme, setUserTheme] = useState<'light' | 'dark' | null>(null);

  // ✅ Load theme whenever tabs come into focus (e.g., returning from news-customization)
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const saved = await AsyncStorage.getItem('appTheme');
          if (saved === 'light' || saved === 'dark') {
            setUserTheme(saved);
          }
        } catch (e) {
          console.warn('Failed to load theme', e);
        }
      })();
    }, [])
  );

  // Use user preference first, then system
  const isDark = userTheme ? userTheme === 'dark' : systemColorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: isDark ? '#FF6B35' : '#FF6B35', // ✅ Using your app's accent color
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          borderTopColor: isDark ? '#1F2937' : '#E5E7EB',
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: 4,
        },
      }}
    >
      {/* ---------- HOME (News Feed) ---------- */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />

      {/* ---------- SEARCH ---------- */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <AntDesign name="search" size={24} color={color} />,
        }}
      />

      {/* ---------- PROFILE ---------- */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}