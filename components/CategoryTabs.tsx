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

// ✅ Fixed: Memoized animated label component
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
      damping: 10,
      stiffness: 150,
    }) }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = 0.95;
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

  // ✅ Fetch categories from Supabase
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

  // ✅ Memoized render scene to prevent unnecessary re-renders
  const renderScene = useMemo(() => {
    return ({ route }: { route: RouteType }) => {
      return <VerticalNewsCarousel category={route.title} />;
    };
  }, []);

  // ✅ Memoized TabBar to prevent unnecessary re-renders
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
          inactiveColor="#9CA3AF"
          renderLabel={({ route, focused, color }: { route: RouteType; focused: boolean; color: string }) => (
            <AnimatedTabLabel
              route={route}
              focused={focused}
              color={color}
              onPress={() => props.jumpTo(route.key)}
            />
          )}
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
    backgroundColor: '#000000' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#000000' 
  },
  loadingText: { 
    color: '#ffffff', 
    fontSize: 16 
  },
  tabBarContainer: { 
    backgroundColor: '#000000', 
    paddingHorizontal: 10, 
    paddingTop: 20, 
    paddingBottom: 10 
  },
  tabBar: { 
    backgroundColor: '#000000', 
    elevation: 0,
    shadowOpacity: 0,
  },
  indicator: { 
    backgroundColor: '#FF0000', 
    height: 3, 
    borderRadius: 2
  },
  tab: { 
    width: 'auto',
    minWidth: 80 
  },
  labelContainer: { 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  activeLabelContainer: { 
    backgroundColor: '#FF2D55' 
  },
  tabLabel: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#FFFFFF' 
  },
  activeTabLabel: { 
    fontWeight: '800', 
    fontSize: 16, 
    color: '#FFFFFF' 
  },
});