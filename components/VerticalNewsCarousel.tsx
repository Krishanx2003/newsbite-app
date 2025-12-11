import { NewsCard } from '@/components/NewsCard';
import { useTheme } from '@/context/ThemeContext';
import { useUserActivity } from '@/context/UserActivityContext';
import { NewsService } from '@/services/news.service';
import { NewsItem } from '@/types';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import PagerView from 'react-native-pager-view';
import {
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

interface VerticalNewsCarouselProps {
  category: string;
}

export function VerticalNewsCarousel({ category }: VerticalNewsCarouselProps) {
  const { colors } = useTheme();
  const { addToHistory } = useUserActivity();
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const pagerRef = useRef<PagerView>(null);
  const activeIndex = useSharedValue(0);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const data = await NewsService.fetchNews(category);

      if (data) {
        setArticles(data);
        // Add first article to history if exists
        if (data.length > 0) addToHistory(data[0]);
      }
      setLoading(false);
    };

    fetchNews();
  }, [category]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ✅ Loading State */}
      {loading && (
        <View style={styles.loaderContainer}>
          <Text style={[styles.loaderText, { color: colors.muted }]}>Loading...</Text>
        </View>
      )}

      {/* ✅ Empty State */}
      {!loading && articles.length === 0 && (
        <View style={styles.loaderContainer}>
          <Text style={[styles.loaderText, { color: colors.muted }]}>No articles found</Text>
        </View>
      )}

      {!loading && articles.length > 0 && (
        <PagerView
          ref={pagerRef}
          style={styles.pager}
          orientation="vertical"
          overScrollMode="never"
          pageMargin={Platform.OS === 'ios' ? 10 : 16}
          offscreenPageLimit={2}
          onPageSelected={(e) => {
            activeIndex.value = withSpring(e.nativeEvent.position, {
              damping: 18,
              stiffness: 90,
            });
            // Track history
            if (articles[e.nativeEvent.position]) {
              addToHistory(articles[e.nativeEvent.position]);
            }
            // Stop speech when changing cards
            Speech.stop();
          }}
        >
          {articles.map((article, index) => (
            <View key={article.id} style={styles.page}>
              <NewsCard article={article} index={index} activeIndex={activeIndex} />
            </View>
          ))}
        </PagerView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 16,
    fontWeight: '500',
  },

  pager: { flex: 1 },
  page: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
