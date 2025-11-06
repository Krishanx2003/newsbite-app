import { router } from 'expo-router'; // ✅ Added
import { Bookmark, ChevronRight, Clock, CreditCard as Edit3, Settings, User } from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  Image,
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

const { width: screenWidth } = Dimensions.get('window');

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

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
        scale.value = withSpring(0.98);
        opacity.value = withTiming(0.8, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
        opacity.value = withTiming(1, { duration: 100 });
      }}
      activeOpacity={1}
    >
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

export default function ProfileTab() {   // ✅ Removed navigation prop
  const profileImageScale = useSharedValue(1);

  const profileImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: profileImageScale.value }],
  }));

  const handlePreferences = () => {
    router.push('/news-customization');  // ✅ Updated navigation
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <AnimatedTouchableOpacity
            style={[styles.profileImageContainer, profileImageStyle]}
            onPress={() => {
              profileImageScale.value = withSpring(0.95, {}, () => {
                profileImageScale.value = withSpring(1);
              });
            }}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2' }}
              style={styles.profileImage}
            />
            <View style={styles.profileImageOverlay}>
              <User size={16} color="#FFFFFF" strokeWidth={2} />
            </View>
          </AnimatedTouchableOpacity>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>Sarah Johnson</Text>
            <Text style={styles.userEmail}>sarah.johnson@example.com</Text>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Edit3 size={16} color="#FF6B35" strokeWidth={2} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu */}
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

          <MenuItem
            icon={<Settings size={22} color="#FF6B35" strokeWidth={2} />}
            title="Preferences"
            subtitle="Customize your news experience"
            onPress={handlePreferences}   // ✅ Works now
          />
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
    paddingBottom: 20,
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FF6B35',
  },
  profileImageOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FF6B35',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3F2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
    marginLeft: 6,
  },
  menuSection: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
  statsSection: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF93',
    flexDirection: 'row',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
});