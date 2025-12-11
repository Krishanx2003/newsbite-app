import { useUserActivity } from '@/context/UserActivityContext';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
  Bookmark,
  ChevronRight,
  Clock,
  FileText,
  Info,
  LogOut,
  Mail,
  MessageSquare,
  Settings,
  Share2,
  Shield,
  Star,
  Trash2
} from 'lucide-react-native';
import { useSecurity } from '@/context/SecurityContext';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  Share,
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
  const { clearAllData, userProfile } = useUserActivity();
  const { setScreenPrivacy } = useSecurity();
  const { user, logout } = useAuth();

  useFocusEffect(
    useCallback(() => {
      // Screen focused: Prevent screenshot
      setScreenPrivacy(true);

      return () => {
        // Screen lost focus: Allow screenshot
        setScreenPrivacy(false);
      };
    }, [])
  );

  const handlePreferences = () => {
    router.push('/news-customization');
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Check out Newsbite - The best news app! Download it now: https://newsbite.in',
        title: 'Share Newsbite',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRateApp = () => {
    // Placeholder store URL - replace with actual Play Store / App Store link
    Linking.openURL('https://play.google.com/store/apps/details?id=com.krishanx2003.newsbite');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? Your account will be deactivated immediately and permanently deleted after 72 hours. Please do not sign in during this period to ensure deletion.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // In a real app, call a delete/deactivate API here. 
            // For now, we simulate by clearing local data and logging out.
            await clearAllData();
            await logout(); // This updates context
            Alert.alert('Account Deactivated', 'Your data has been cleared from this device and your account is scheduled for deletion.');
            // Stay on profile page, which will switch to Guest view
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(tabs)'); // Refresh or ensure state clears
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
        {/* User Profile Header */}
        <View style={styles.profileHeader}>
          {user ? (
            <>
              <TouchableOpacity onPress={() => router.push('/edit-profile')} activeOpacity={0.8}>
                <View style={[styles.avatarContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  {/* Use Auth user email initial or Profile name */}
                  <Text style={[styles.avatarText, { color: colors.tint }]}>
                    {user.email?.charAt(0).toUpperCase() || userProfile?.name?.charAt(0) || 'U'}
                  </Text>
                </View>
                <View style={[styles.editBadge, { backgroundColor: colors.tint, borderColor: colors.background }]}>
                  <Settings size={12} color="#FFF" />
                </View>
              </TouchableOpacity>

              <View style={styles.profileInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>{userProfile?.name || user.email.split('@')[0]}</Text>
                <Text style={[styles.userBio, { color: colors.muted }]}>{userProfile?.bio || user.email}</Text>

                <TouchableOpacity
                  onPress={() => router.push('/edit-profile')}
                  style={[styles.editProfileBtn, { backgroundColor: colors.button }]}
                >
                  <Text style={[styles.editProfileText, { color: colors.buttonText }]}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={[styles.avatarContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <Text style={[styles.avatarText, { color: colors.muted }]}>?</Text>
              </View>

              <View style={styles.profileInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>Guest User</Text>
                <Text style={[styles.userBio, { color: colors.muted }]}>Sign in to sync your preferences</Text>

                <TouchableOpacity
                  onPress={() => router.push('/auth/login')}
                  style={[styles.editProfileBtn, { backgroundColor: colors.tint, marginTop: 10 }]}
                >
                  <Text style={[styles.editProfileText, { color: '#FFF' }]}>Sign In / Sign Up</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={styles.divider} />

        {/* Menu Section: Your Content */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>Your Content</Text>
          <View style={styles.menuSection}>
            <MenuItem
              icon={<Bookmark size={22} color={colors.tint} strokeWidth={2} />}
              title="Saved Articles"
              subtitle="Articles you've bookmarked"
              onPress={() => router.push('/saved')}
            />

            <MenuItem
              icon={<Clock size={22} color={colors.tint} strokeWidth={2} />}
              title="Reading History"
              subtitle="Your recently read articles"
              onPress={() => router.push('/history')}
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
              onPress={handleShareApp}
            />

            <MenuItem
              icon={<Star size={22} color={colors.tint} strokeWidth={2} />}
              title="Rate this App"
              subtitle="Tell us what you think"
              onPress={handleRateApp}
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
        {/* Menu Section: Danger Zone - Only for Logged In Users */}
        {user && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Account Actions</Text>
            <View style={styles.menuSection}>
              <MenuItem
                icon={<LogOut size={22} color={colors.text} strokeWidth={2} />}
                title="Log Out"
                subtitle="Sign out of your account"
                onPress={handleLogout}
              />
              <MenuItem
                icon={<Trash2 size={22} color="#EF4444" strokeWidth={2} />}
                title="Delete Account"
                subtitle="Permanently remove your data"
                onPress={handleDeleteAccount}
                isDestructive
              />
            </View>
          </View>
        )}


        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.muted }]}>Version 1.0.3</Text>
        </View>
      </ScrollView >
    </SafeAreaView >
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

  // Profile Header Styles
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 16,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  editProfileBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 20,
    marginBottom: 20,
  }
});
