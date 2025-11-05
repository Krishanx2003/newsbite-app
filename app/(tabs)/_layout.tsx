// app/(tabs)/layout.tsx
import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null

  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,               // show the text under icons
        tabBarActiveTintColor: isDark ? '#60A5FA' : '#2563EB', // blue-400 / blue-600
        tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280', // gray-400 / gray-500
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          borderTopColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter-Medium',
          marginTop: 2,
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
          tabBarIcon: ({ color }) => <AntDesign name="profile" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}