// app/news-customization.tsx 
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router'; // ✅ Added
import { useSecurity } from '@/context/SecurityContext'; // ✅ Added
import { ChevronLeft, Moon, Shield, Sun } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function NewsCustomizationScreen() {
  const { colors, isDark, toggleTheme, fontSize, setFontSize } = useTheme();
  const { isAppLockEnabled, toggleAppLock } = useSecurity();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Appearance</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Theme Toggle Card */}
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: isDark ? '#000' : '#000' }]}>
          <View style={styles.toggleRow}>
            {isDark ? (
              <Moon size={22} color={colors.tint} />
            ) : (
              <Sun size={22} color={colors.tint} />
            )}
            <Text style={[styles.toggleLabel, { color: colors.text }]}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Switch
              trackColor={{ false: '#E5E7EB', true: colors.tint }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E7EB"
              value={isDark}
              onValueChange={toggleTheme}
            />
          </View>
        </View>

        {/* Security Card */}
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: isDark ? '#000' : '#000' }]}>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Security</Text>
          <View style={styles.toggleRow}>
            <Shield size={22} color={colors.tint} />
            <Text style={[styles.toggleLabel, { color: colors.text }]}>
              Biometric App Lock
            </Text>
            <Switch
              trackColor={{ false: '#E5E7EB', true: colors.tint }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E7EB"
              value={isAppLockEnabled}
              onValueChange={toggleAppLock}
            />
          </View>
        </View>

        {/* Font Size Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Text Size</Text>
          <View style={styles.fontSizeRow}>
            <TouchableOpacity
              onPress={() => setFontSize('small')}
              style={[styles.sizeBtn, fontSize === 'small' && { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB' }]}
            >
              <Text style={[styles.sizeText, { fontSize: 14, color: colors.text }]}>A</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFontSize('medium')}
              style={[styles.sizeBtn, fontSize === 'medium' && { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB' }]}
            >
              <Text style={[styles.sizeText, { fontSize: 18, color: colors.text }]}>A</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFontSize('large')}
              style={[styles.sizeBtn, fontSize === 'large' && { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB' }]}
            >
              <Text style={[styles.sizeText, { fontSize: 24, fontWeight: 'bold', color: colors.text }]}>A</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Onboarding Tour Card */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>General</Text>
          <TouchableOpacity
            style={[styles.tourButton, { backgroundColor: colors.tint }]}
            onPress={() => router.push('/onboarding?replay=true')}
          >
            <Text style={styles.tourButtonText}>View Welcome Tour</Text>
            <ChevronLeft size={20} color="#FFF" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.infoText, { color: colors.muted }]}>
            Toggle to switch between light and dark themes. Your preference will be saved automatically.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Styles – matches ProfileTab exactly
// ──────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollContent: { paddingBottom: 40 },
  card: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  infoContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  fontSizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    padding: 4,
  },
  sizeBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
  },
  sizeText: {
    fontWeight: '600',
  },
  tourButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  tourButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  }
});