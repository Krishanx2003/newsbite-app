import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import {
  Bookmark,
  ChevronRight,
  Clock,
  FileText,
  Info,
  Mail,
  MessageSquare,
  Settings,
  Share2,
  Shield,
  Star,
  Trash2
} from 'lucide-react-native';
import React from 'react';
import {
  Alert,
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
  isDestructive?: boolean;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

function MenuItem({ icon, title, subtitle, onPress, isDestructive }: MenuItemProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedTouchableOpacity
      style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }, animatedStyle, isDestructive && styles.destructiveItem]}
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
        <View style={[styles.iconContainer, { backgroundColor: isDestructive ? '#FEE2E2' : colors.background }, isDestructive && styles.destructiveIconContainer]}>{icon}</View>
        <View style={styles.menuItemContent}>
          <Text style={[styles.menuItemTitle, { color: colors.text }, isDestructive && styles.destructiveText]}>{title}</Text>
          <Text style={[styles.menuItemSubtitle, { color: colors.muted }]}>{subtitle}</Text>
        </View>
      </View>
      <ChevronRight size={20} color={isDestructive ? "#EF4444" : colors.muted} strokeWidth={2} />
    </AnimatedTouchableOpacity>
  );
}

export default function ProfileTab() {
  const { colors, toggleTheme, theme } = useTheme();

  const handlePreferences = () => {
    router.push('/news-customization');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            //! TODO
            // Implement actual deletion logic here
            Alert.alert('Account Deleted', 'Your account will be checked and deleted within 72 hours.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
          <Text style={[styles.headerSubtitle, { color: colors.muted }]}>
            Manage your account and preferences
          </Text>
        </View>

        {/* Menu Section: Your Content */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>Your Content</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={<Bookmark size={22} color={colors.tint} strokeWidth={2} />}
              title="Saved Articles"
              subtitle="Articles you've bookmarked"
              onPress={() => { }}
            />

            <MenuItem
              icon={<Clock size={22} color={colors.tint} strokeWidth={2} />}
              title="Reading History"
              subtitle="Your recently read articles"
              onPress={() => { }}
            />
          </View>
        </View>

        {/* Menu Section: App Settings */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>App Settings</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={<Settings size={22} color={colors.tint} strokeWidth={2} />}
              title="Preferences"
              subtitle="Customize your news experience"
              onPress={handlePreferences}
            />
            {/* Theme Toggle Removed - Moved to Preferences */}

            <MenuItem
              icon={<Info size={22} color={colors.tint} strokeWidth={2} />}
              title="About Newsbite"
              subtitle="Version, ownership, and mission"
              onPress={() => router.push('/about')}
            />
            <MenuItem
              icon={<MessageSquare size={22} color={colors.tint} strokeWidth={2} />}
              title="Contact Us"
              subtitle="Email, phone, and website"
              onPress={() => router.push('/contact')}
            />
          </View>
        </View>

        {/* Menu Section: Support */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>Support</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={<Share2 size={22} color={colors.tint} strokeWidth={2} />}
              title="Share this App"
              subtitle="Invite friends to try the app"
              onPress={() => { }}
            />

            <MenuItem
              icon={<Star size={22} color={colors.tint} strokeWidth={2} />}
              title="Rate this App"
              subtitle="Tell us what you think"
              onPress={() => { }}
            />

            <MenuItem
              icon={
                <MessageSquare size={22} color={colors.tint} strokeWidth={2} />
              }
              title="Send Feedback"
              subtitle="Help us improve the app"
              onPress={() => router.push('/contact')}
            />
          </View>
        </View>

        {/* Menu Section: Legal */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>Legal</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={<FileText size={22} color={colors.tint} strokeWidth={2} />}
              title="Terms & Conditions"
              subtitle="Read our terms of service"
              onPress={() => router.push('/terms')}
            />

            <MenuItem
              icon={<Shield size={22} color={colors.tint} strokeWidth={2} />}
              title="Privacy Policy"
              subtitle="How we protect your data"
              onPress={() => router.push('/privacy')}
            />
          </View>
        </View>

        {/* Menu Section: Danger Zone */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Danger Zone</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={<Trash2 size={22} color="#EF4444" strokeWidth={2} />}
              title="Delete Account"
              subtitle="Permanently remove your data"
              onPress={handleDeleteAccount}
              isDestructive
            />
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.muted }]}>Version 1.0.3</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
  },
  sectionContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
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
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 13,
  },
  destructiveItem: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  destructiveIconContainer: {
    backgroundColor: '#FEE2E2',
  },
  destructiveText: {
    color: '#EF4444',
  },
});
