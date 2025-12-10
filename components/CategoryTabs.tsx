import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useMemo, useState } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  TabBar,
  TabView
} from 'react-native-tab-view';

import { VerticalNewsCarousel } from './VerticalNewsCarousel';

type RouteType = { key: string; title: string };

const AnimatedTabLabel = ({
  route,
  focused,
  color,
  onPress,
  themeColors,
  isDark
}: {
  route: RouteType;
  focused: boolean;
  color: string;
  onPress: () => void;
  themeColors: any;
  isDark: boolean;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(scale.value, {
          damping: 12,
          stiffness: 180,
        }),
      },
    ],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = 0.93)}
      onPressOut={() => {
        scale.value = 1;
        onPress();
      }}
      style={[styles.labelContainer,
      { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#E5E7EB' },
      focused && styles.activeLabelContainer
      ]}
    >
      <Animated.View style={animatedStyle}>
        <Text style={[
          styles.tabLabel,
          { color: color },
          focused && styles.activeTabLabel
        ]}>
          {route.title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export function CategoryTabs() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('created_at', { ascending: true });

      if (!error && data) {
        const fetchedRoutes = data.map((c) => ({
          key: c.name.toLowerCase().replace(/\s+/g, '-'),
          title: c.name,
        }));

        // ✅ Add My Feed as default first tab
        setRoutes([{ key: 'my-feed', title: 'My Feed' }, ...fetchedRoutes]);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  // ✅ Load ALL news in My Feed
  const renderScene = useMemo(() => {
    return ({ route }: { route: RouteType }) => {
      if (route.key === 'my-feed') {
        return <VerticalNewsCarousel category="all" />;
      }
      return <VerticalNewsCarousel category={route.title} />;
    };
  }, []);

  const { colors, isDark } = useTheme();

  const renderTabBar = useMemo(() => {
    return (props: any) => (
      <View style={[styles.tabBarWrapper, { backgroundColor: isDark ? 'rgba(20,20,20,0.95)' : '#FFFFFF', borderBottomColor: colors.border }]}>
        <TabBar
          {...props}
          scrollEnabled
          indicatorStyle={{ height: 0 }}
          style={styles.tabBar}
          tabStyle={styles.tab}
          activeColor={isDark ? '#FFFFFF' : '#000000'}
          inactiveColor={isDark ? '#9CA3AF' : '#000000'}
          // ✅ Fix TypeScript error (TS doesn't know renderLabel exists)
          // @ts-ignore
          renderLabel={(labelProps: {
            route: RouteType;
            focused: boolean;
            color: string;
          }) => (
            <AnimatedTabLabel
              route={labelProps.route}
              focused={labelProps.focused}
              color={labelProps.focused ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#000000')}
              onPress={() => {
                const newIndex = props.navigationState.routes.findIndex(
                  (r: RouteType) => r.key === labelProps.route.key
                );
                setIndex(newIndex);
              }}
              themeColors={colors}
              isDark={isDark}
            />
          )}
        />
      </View>
    );
  }, [routes, colors, isDark]);

  // Loading states using colors.background and colors.text
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.muted }]}>Loading categories...</Text>
      </View>
    );
  }

  if (routes.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.muted }]}>No categories found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        swipeEnabled
        lazy
        lazyPreloadDistance={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },

  tabBarWrapper: {
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },

  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },

  tab: {
    width: 'auto',
    marginHorizontal: 4,
  },

  labelContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(128,128,128,0.1)', // Generic generic background
  },

  activeLabelContainer: {
    backgroundColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },

  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  activeTabLabel: {
    color: '#FFFFFF',
  },
});
