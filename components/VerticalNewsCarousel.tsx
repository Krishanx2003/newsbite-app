import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { TriangleAlert } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
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
const CARD_HEIGHT = SCREEN_HEIGHT * 0.8; // Reduced initial height estimate
const CARD_WIDTH = SCREEN_WIDTH - 5;

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  published_at: string;
  image_url: string | null;
  source?: string;
}

interface VerticalNewsCarouselProps {
  category: string;
}

export function VerticalNewsCarousel({ category }: VerticalNewsCarouselProps) {
  const { colors, isDark } = useTheme();
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const pagerRef = useRef<PagerView>(null);
  const activeIndex = useSharedValue(0);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);

      // Calculate date 3 months ago
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const threeMonthsAgoISO = threeMonthsAgo.toISOString();

      let query = supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .gte('published_at', threeMonthsAgoISO) // Only articles from last 3 months
        .order('published_at', { ascending: false });

      // ✅ MY FEED: load all news
      if (category !== 'all') {
        query = query.eq('category', category);
      }

      const { data } = await query;

      if (data) setArticles(data);
      setLoading(false);
    };

    fetchNews();
  }, [category]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
        <View style={[styles.card, { backgroundColor: colors.card }]}>

          {article?.image_url && (
            <>
              <Image
                source={{ uri: article.image_url }}
                style={styles.image}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)', isDark ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.1)']} // Adjust gradient for light mode? Actually gradient overlay on image usually stays dark for text readability if text is over image. But here text is below image. Wait, design has image top half, content bottom half.
                // The gradient seems to be an overlay on the BOTTOM of the image? 
                // "bottom: 0, height: 55%" -> Yes.
                // If text is NOT on the image, we don't strictly need a strong gradient unless it blends into the card background.
                // In Dark Mode: Card is #1F2937 (or similar). Gradient goes to 0.95 opacity black/dark? 
                // Let's keep gradient simple or adjust if needed. For now, keep as is or slight adjust.
                style={styles.imageGradient}
              />
            </>
          )}

          <View style={styles.content}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {article.category.toUpperCase()}
              </Text>
            </View>

            <Text style={[styles.headline, { color: colors.text }]} numberOfLines={4}>
              {article.title}
            </Text>

            <View style={styles.divider} />

            <Text style={[styles.description, { color: colors.muted }]} numberOfLines={6}>
              {article.content}
            </Text>
            <View style={[styles.footer, { borderColor: colors.border }]}>
              <View>
                <Text style={styles.source}>Publisher: {article.source || 'Newsbite'}</Text>
                <Text style={[styles.date, { color: colors.muted }]}>{formatDate(article.published_at)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Report Article',
                    'Would you like to report this content as inappropriate?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Report',
                        onPress: () => Alert.alert('Thank you', 'We have received your report and will review this content.')
                      }
                    ]
                  );
                }}
                style={[styles.reportButton, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
              >
                <TriangleAlert size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

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
          }}
        >
          {articles.map((article, index) => (
            <View key={article.id} style={styles.page}>
              <NewsCard article={article} index={index} />
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

  cardContainer: {
    width: CARD_WIDTH,
    flex: 1, // Take full height of the page
    marginVertical: 10, // Add explicit margin to prevent overlap
    justifyContent: 'center',
  },

  card: {
    flex: 1, // Fill the container
    borderRadius: 26,
    overflow: 'hidden',
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

  categoryText: {
    color: '#0EA5E9',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },

  headline: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },

  divider: {
    width: 50,
    height: 3,
    backgroundColor: '#0EA5E9',
    borderRadius: 2,
    marginBottom: 14,
  },

  description: {
    fontSize: 15.5,
    lineHeight: 25,
  },

  footer: {
    marginTop: 'auto',
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  date: { fontSize: 13 },
  source: { color: '#0EA5E9', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  reportButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
  },
});
