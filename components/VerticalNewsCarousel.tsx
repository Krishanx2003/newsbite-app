import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.90;
const CARD_WIDTH = SCREEN_WIDTH - 5;

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  published_at: string;
  image_url: string | null;
}

interface VerticalNewsCarouselProps {
  category: string;
}

export function VerticalNewsCarousel({ category }: VerticalNewsCarouselProps) {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const pagerRef = useRef<PagerView>(null);
  const activeIndex = useSharedValue(0);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from('news')
        .select('*')
        .eq('category', category)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (data) setArticles(data);
      setLoading(false);
    };

    fetchNews();
  }, [category]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const NewsCard = ({ article, index }: { article: NewsItem; index: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [0.94, 1, 0.94],
        Extrapolate.CLAMP
      );

      const opacity = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [0.65, 1, 0.65],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <View style={styles.card}>
        {article?.image_url && (
  <>
    <Image
      source={{ uri: article.image_url }}
      style={styles.image}
      resizeMode="cover"
    />
    <LinearGradient
      colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
      style={styles.imageGradient}
    />
  </>
)}


          <View style={styles.content}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
            </View>

            <Text style={styles.headline} numberOfLines={4}>
              {article.title}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.description} numberOfLines={6}>
              {article.content}
            </Text>

            <View style={styles.footer}>
              <Text style={styles.date}>{formatDate(article.published_at)}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
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
        }}
      >
        {articles.map((article, index) => (
          <View key={article.id} style={styles.page}>
            <NewsCard article={article} index={index} />
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  pager: { flex: 1 },
  page: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT * 0.96,
    justifyContent: 'center',
  },

  card: {
    flex: 1,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#111418',
  },

  image: {
    width: '100%',
    height: '50%',
  },

  imageGradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '55%',
  },

  content: { flex: 1, padding: 22 },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(14,165,233,0.25)',
    borderWidth: 1,
    borderColor: '#0EA5E9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 14,
  },
  categoryText: { color: '#0EA5E9', fontWeight: '700', fontSize: 12, letterSpacing: 1 },

  headline: { fontSize: 24, fontWeight: '800', color: '#F9FAFB', marginBottom: 12 },
  divider: { width: 50, height: 3, backgroundColor: '#0EA5E9', borderRadius: 2, marginBottom: 14 },
  description: { fontSize: 15.5, color: '#D1D5DB', lineHeight: 25 },
  footer: { marginTop: 'auto', paddingTop: 12, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  date: { color: '#9CA3AF', fontSize: 13 },
});
