import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Animated as RNAnimated, StyleSheet, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.88;
const CARD_WIDTH = SCREEN_WIDTH - 32; // 16px padding on each side

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

  // Shimmer animation for skeleton
  const shimmerAnim = useRef(new RNAnimated.Value(0)).current;

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

  useEffect(() => {
    if (loading) {
      RNAnimated.loop(
        RNAnimated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [loading, shimmerAnim]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const NewsCard = ({ article, index }: { article: NewsItem; index: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [0.92, 1, 0.92],
        Extrapolate.CLAMP
      );

      const opacity = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [0.6, 1, 0.6],
        Extrapolate.CLAMP
      );

      const translateY = interpolate(
        activeIndex.value,
        [index - 1, index, index + 1],
        [20, 0, -20],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }, { translateY }],
        opacity,
      };
    });

    return (
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <View style={styles.card}>
          {article.image_url ? (
            <>
              <Image
                source={{ uri: article.image_url }}
                style={styles.image}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                style={styles.imageGradient}
                locations={[0, 0.5, 1]}
              />
            </>
          ) : (
            <View style={styles.placeholderImage}>
              <LinearGradient
                colors={['#1F2937', '#111827']}
                style={StyleSheet.absoluteFill}
              />
            </View>
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

  // Skeleton Card Component
  const SkeletonCard = () => {
    const shimmerTranslate = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-CARD_WIDTH, CARD_WIDTH],
    });

    return (
      <View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
        <View style={styles.card}>
          {/* Image Skeleton */}
          <View style={styles.skeletonImage}>
            <RNAnimated.View
              style={[
                styles.shimmer,
                { transform: [{ translateX: shimmerTranslate }] },
              ]}
            />
          </View>

          <View style={styles.content}>
            {/* Category Badge Skeleton */}
            <View style={styles.skeletonBadge} />

            {/* Title Lines */}
            {[...Array(3)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.skeletonLine,
                  i === 0 ? styles.skeletonTitle1 : i === 1 ? styles.skeletonTitle2 : styles.skeletonTitle3,
                ]}
              >
                <RNAnimated.View style={styles.shimmer} />
              </View>
            ))}

            <View style={styles.divider} />

            {/* Description Lines */}
            {[...Array(4)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.skeletonLine,
                  styles.skeletonDescription,
                  i === 3 && { width: '60%' },
                ]}
              >
                <RNAnimated.View style={styles.shimmer} />
              </View>
            ))}

            {/* Date Skeleton */}
            <View style={styles.skeletonFooter}>
              <View style={styles.skeletonDate}>
                <RNAnimated.View style={styles.shimmer} />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.page}>
          <SkeletonCard />
        </View>
      </View>
    );
  }

  if (articles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No articles found</Text>
        <Text style={styles.emptySubtext}>Check back later for updates</Text>
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
            damping: 20,
            stiffness: 120,
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
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#E5E7EB',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#6B7280',
    fontSize: 14,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 2,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  // === Real Card Styles ===
  image: {
    width: '100%',
    height: '45%',
    backgroundColor: '#1F2937',
  },
  placeholderImage: {
    width: '100%',
    height: '45%',
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  content: {
    flex: 1,
    padding: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 20,
  },
  categoryText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  divider: {
    width: 40,
    height: 3,
    backgroundColor: '#0EA5E9',
    borderRadius: 2,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 26,
    marginBottom: 12,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  date: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
 
  // === Skeleton Styles ===
  skeletonImage: {
    width: '100%',
    height: '45%',
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  skeletonBadge: {
    width: 80,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  skeletonLine: {
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  skeletonTitle1: { width: '95%' },
  skeletonTitle2: { width: '85%' },
  skeletonTitle3: { width: '70%' },
  skeletonDescription: {
    height: 16,
    marginBottom: 8,
  },
  skeletonFooter: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  skeletonDate: {
    width: 100,
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: '50%',
  },
});