import { categories, mockNewsData } from '@/data/mockNews';
import React, { useState } from 'react';
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
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { VerticalNewsCarousel } from './VerticalNewsCarousel';

const renderScene = SceneMap({
  topstories: () => (
    <VerticalNewsCarousel
      articles={mockNewsData.filter(
        (article) => article.category === 'topstories'
      )}
    />
  ),
  trending: () => (
    <VerticalNewsCarousel
      articles={mockNewsData.filter(
        (article) => article.category === 'trending'
      )}
    />
  ),
  technology: () => (
    <VerticalNewsCarousel
      articles={mockNewsData.filter(
        (article) => article.category === 'technology'
      )}
    />
  ),
  sports: () => (
    <VerticalNewsCarousel
      articles={mockNewsData.filter(
        (article) => article.category === 'sports'
      )}
    />
  ),
});

export function CategoryTabs() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState(
    categories.map((cat) => ({ key: cat.key, title: cat.title }))
  );

  const renderTabBar = (props: any) => (
    <View style={styles.tabBarContainer}>
      <TabBar
        {...props}
        indicatorStyle={styles.indicator}
        style={styles.tabBar}
        labelStyle={styles.tabLabel}
        activeColor="#FFFFFF"
        inactiveColor="#FFFFFF"
        scrollEnabled
        tabStyle={styles.tab}
        renderLabel={({
          route,
          focused,
          color,
        }: {
          route: { key: string; title: string };
          focused: boolean;
          color: string;
        }) => {
          // One shared value per label
          const scale = useSharedValue(1);

          const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: withSpring(scale.value) }],
          }));

          return (
            <Pressable
              onPressIn={() => {
                scale.value = 0.95;
              }}
              onPressOut={() => {
                scale.value = 1;
                props.jumpTo(route.key);
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
        }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        swipeEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  tabBarContainer: {
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 1,
    elevation: 10,
  },
  tabBar: {
    backgroundColor: '#000000',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    height: 56,
  },
  indicator: {
    backgroundColor: '#FF0000',
    height: 4,
    borderRadius: 3,
    marginBottom: 6,
  },
  tab: {
    width: 'auto',
    minWidth: 100,
    paddingHorizontal: 8,
  },
  labelContainer: {
    paddingHorizontal: 40,
    paddingVertical: 22,
    borderRadius: 14,
    backgroundColor: 'transparent',
    minHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeLabelContainer: {
    backgroundColor: '#FF2D55',
  },
  tabLabel: {
    fontSize: 32,
    fontFamily: 'Roboto',
    textTransform: 'capitalize',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  activeTabLabel: {
    fontFamily: 'Roboto',
    fontWeight: '900',
    fontSize: 30,
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    letterSpacing: 0.8,
  },
});