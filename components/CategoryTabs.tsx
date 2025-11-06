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
import { NavigationState, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view';
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
    transform: [{ scale: withSpring(scale.value, {
      damping: 12,
      stiffness: 180,
    }) }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = 0.93;
      }}
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
        <Text
          style={[
            styles.tabLabel,
            { color },
            focused && styles.activeTabLabel,
          ]}
        >
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
    return ({ route }: { route: RouteType }) => {
      return <VerticalNewsCarousel category={route.title} />;
    };
  }, []);

  const renderTabBar = useMemo(() => {
    return (props: SceneRendererProps & { navigationState: NavigationState<RouteType> }) => (
      <View style={styles.tabBarContainer}>
        <TabBar
          {...props}
          indicatorStyle={styles.indicator}
          style={styles.tabBar}
          scrollEnabled
          tabStyle={styles.tab}
          activeColor="#FFFFFF"
          inactiveColor="#6B7280"
        
        />
      </View>
    );
  }, []);

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
    backgroundColor: '#0A0A0A'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A'
  },
  loadingText: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '500',
  },
  tabBarContainer: {
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 12,
  },
  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  indicator: {
    backgroundColor: '#0EA5E9',
    height: 3,
    borderRadius: 2,
  },
  tab: {
    width: 'auto',
    minWidth: 70,
  },
  labelContainer: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeLabelContainer: {
    backgroundColor: '#0EA5E9',
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabLabel: {
    fontWeight: '700',
    fontSize: 15,
    color: '#FFFFFF',
  },
});
