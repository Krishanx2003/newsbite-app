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
import { NavigationState, SceneRendererProps, TabBar, TabBarProps, TabView } from 'react-native-tab-view';
import { VerticalNewsCarousel } from './VerticalNewsCarousel';

type RouteType = { key: string; title: string };

const AnimatedTabLabel = React.memo(({
  route,
  focused,
  color,
  onPress
}: {
  route: RouteType;
  focused: boolean;
  color: string;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 12, stiffness: 180 }) }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = 0.93)}
      onPressOut={() => {
        scale.value = 1;
        onPress();
      }}
      style={[
        styles.labelContainer,
        focused && styles.activeLabelContainer,
      ]}
    >
      <Animated.View style={animatedStyle}>
        <Text style={[styles.tabLabel, focused && styles.activeTabLabel]}>
          {route.title}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

AnimatedTabLabel.displayName = 'AnimatedTabLabel';

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
        setRoutes(
          data.map((c) => ({
            key: c.name.toLowerCase().replace(/\s+/g, '-'),
            title: c.name,
          }))
        );
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const renderScene = useMemo(() => {
    return ({ route }: { route: RouteType }) => (
      <VerticalNewsCarousel category={route.title} />
    );
  }, []);

      const renderTabBar = useMemo(() => {
        return (props: TabBarProps<RouteType>) => (
          <View style={styles.tabBarWrapper}>
            <TabBar
              {...props}
              scrollEnabled
              indicatorStyle={{ height: 0 }}
              style={styles.tabBar}
              tabStyle={styles.tab}
              // @ts-expect-error: renderLabel is not part of TabBarProps type but is supported at runtime
              renderLabel={(props: {
                navigationState: any; route: RouteType; focused: boolean 
}) => (
                <AnimatedTabLabel
                  route={props.route}
                  focused={props.focused}
                  color={props.focused ? '#FFFFFF' : '#9CA3AF'}
                  onPress={() => {
                    const newIndex = props.navigationState.routes.findIndex((r: { key: () => ArrayIterator<number>; }) => r.key === routes.keys);
                    setIndex(newIndex);
                  }}
                />
              )}
            />
          </View>
        );
      }, [setIndex]);
      

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (routes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No categories found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
    backgroundColor: '#0B0B0B',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0B0B',
  },
  loadingText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '500',
  },

  tabBarWrapper: {
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(20,20,20,0.75)',
    borderBottomColor: '#1F2937',
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
    backgroundColor: 'rgba(255,255,255,0.06)',
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
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },

  activeTabLabel: {
    color: '#FFFFFF',
  },
});
