import { router } from 'expo-router';
import {
  Bookmark,
  ChevronRight,
  Clock,
  FileText,
  MessageSquare,
  Settings,
  Share2,
  Shield,
  Star,
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
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

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

function MenuItem({ icon, title, subtitle, onPress }: MenuItemProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedTouchableOpacity
      style={[styles.menuItem, animatedStyle]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97);
        opacity.value = withTiming(0.7, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
        opacity.value = withTiming(1, { duration: 100 });
      }}
      activeOpacity={1}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
    </AnimatedTouchableOpacity>
  );
}

export default function ProfileTab() {
  const handlePreferences = () => {
    router.push('/news-customization');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Menu Section: Your Content */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Content</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={<Bookmark size={22} color="#FF6B35" strokeWidth={2} />}
              title="Saved Articles"
              subtitle="Articles you've bookmarked"
              onPress={() => console.log('Saved articles pressed')}
            />

            <MenuItem
              icon={<Clock size={22} color="#FF6B35" strokeWidth={2} />}
              title="Reading History"
              subtitle="Your recently read articles"
              onPress={() => console.log('Reading history pressed')}
            />
          </View>
        </View>

        {/* Menu Section: App Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={<Settings size={22} color="#FF6B35" strokeWidth={2} />}
              title="Preferences"
              subtitle="Customize your news experience"
              onPress={handlePreferences}
            />
          </View>
        </View>

        {/* Menu Section: Support */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={<Share2 size={22} color="#FF6B35" strokeWidth={2} />}
              title="Share this App"
              subtitle="Invite friends to try the app"
              onPress={() => console.log('Share app')}
            />

            <MenuItem
              icon={<Star size={22} color="#FF6B35" strokeWidth={2} />}
              title="Rate this App"
              subtitle="Tell us what you think"
              onPress={() => console.log('Rate app')}
            />

            <MenuItem
              icon={
                <MessageSquare size={22} color="#FF6B35" strokeWidth={2} />
              }
              title="Send Feedback"
              subtitle="Help us improve the app"
              onPress={() => console.log('Feedback pressed')}
            />
          </View>
        </View>

        {/* Menu Section: Legal */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={<FileText size={22} color="#FF6B35" strokeWidth={2} />}
              title="Terms & Conditions"
              subtitle="Read our terms of service"
              onPress={() => router.push('/terms')}
            />

            <MenuItem
              icon={<Shield size={22} color="#FF6B35" strokeWidth={2} />}
              title="Privacy Policy"
              subtitle="How we protect your data"
              onPress={() => router.push('/privacy')}
            />
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
