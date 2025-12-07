// app/news-customization.tsx 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router'; // ✅ Added
import { ChevronLeft, Moon, Sun } from 'lucide-react-native';
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

export default function NewsCustomizationScreen() {  // ✅ Removed navigation prop
  const [isDark, setIsDark] = useState(false);

  // Load saved theme
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('appTheme');
        if (saved === 'dark') setIsDark(true);
      } catch (e) {
        console.warn('Failed to load theme', e);
      }
    })();
  }, []);

  // Save theme
  const saveTheme = async () => {
    try {
      await AsyncStorage.setItem('appTheme', isDark ? 'dark' : 'light');
      Alert.alert('Saved', `Theme set to ${isDark ? 'Dark' : 'Light'} Mode`);
    } catch (e) {
      Alert.alert('Error', 'Could not save theme');
    }
  };

  // Animated press feedback
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Theme Toggle Card */}
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            {isDark ? (
              <Moon size={22} color="#FF6B35" />
            ) : (
              <Sun size={22} color="#FF6B35" />
            )}
            <Text style={styles.toggleLabel}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Switch
              trackColor={{ false: '#E5E7EB', true: '#FF6B35' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E7EB"
              value={isDark}
              onValueChange={setIsDark}
            />
          </View>
        </View>

        {/* Save Button */}
        <AnimatedTouchable
          style={[styles.saveBtn, animatedStyle]}
          onPress={saveTheme}
          onPressIn={() => {
            scale.value = withSpring(0.97);
            opacity.value = withTiming(0.8);
          }}
          onPressOut={() => {
            scale.value = withSpring(1);
            opacity.value = withTiming(1);
          }}
          activeOpacity={1}
        >
          <Text style={styles.saveBtnText}>Save Theme</Text>
        </AnimatedTouchable>
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
    color: '#1F2937',
  },
  saveBtn: {
    marginHorizontal: 16,
    marginTop: 32,
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});