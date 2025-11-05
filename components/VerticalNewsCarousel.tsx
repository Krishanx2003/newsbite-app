import { supabase } from '@/lib/supabase';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.85;

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const pagerRef = useRef<PagerView>(null);
  const activeIndex = useSharedValue(0);

  // ✅ Fetch news by category from Supabase
  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('category', category)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (!error && data) {
        setArticles(data);
      }
      setLoading(false);
    };

    fetchNews();
  }, [category]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const NewsCard = ({ article, index }: { article: NewsItem; index: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [0.9, 1, 0.9],
        Extrapolate.CLAMP
      );

      const opacity = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [0.5, 1, 0.5],
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
          {article.image_url && (
            <Image
              source={{ uri: article.image_url }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          <View style={styles.overlay} />

          <View style={styles.content}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
            </View>

            <Text style={styles.headline} numberOfLines={3}>{article.title}</Text>
            <Text style={styles.description} numberOfLines={4}>
              {article.content?.slice(0, 140)}...
            </Text>

            <View style={styles.footer}>
              <Text style={styles.date}>{formatDate(article.published_at)}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#fff' }}>Loading News...</Text>
      </View>
    );
  }

  if (articles.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#fff' }}>No articles found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        orientation="vertical"
        onPageSelected={(e) => {
          const newIndex = e.nativeEvent.position;
          setCurrentIndex(newIndex);
          activeIndex.value = withSpring(newIndex, {
            damping: 15,
            stiffness: 100,
          });
        }}
        scrollEnabled
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
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#000' 
  },
  pager: { flex: 1 },
  page: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20 
  },
  cardContainer: { 
    width: SCREEN_WIDTH - 40, 
    height: CARD_HEIGHT 
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1F2937',
  },
  image: { 
    width: '100%', 
    height: '40%', 
    backgroundColor: '#374151' 
  },
  overlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    height: '40%', 
    backgroundColor: 'rgba(0,0,0,0.3)' 
  },
  content: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: '60%',
    padding: 24, 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32,
  },
  categoryBadge: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#2563EB', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16, 
    marginTop: -16, 
    marginBottom: 16 
  },
  categoryText: { 
    fontSize: 10, 
    color: '#fff', 
    fontWeight: '600' 
  },
  headline: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#1F2937', 
    marginBottom: 12,
    lineHeight: 28 
  },
  description: { 
    fontSize: 15, 
    color: '#6B7280', 
    lineHeight: 22, 
    marginBottom: 10 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    paddingTop: 12,
    marginTop: 'auto'
  },
  date: { 
    fontSize: 13, 
    color: '#9CA3AF' 
  }
});