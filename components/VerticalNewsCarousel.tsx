import { NewsArticle } from '@/data/mockNews';
import React, { useRef, useState } from 'react';
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
const CARD_HEIGHT = SCREEN_HEIGHT * 0.95;

interface VerticalNewsCarouselProps {
  articles: NewsArticle[];
}

export function VerticalNewsCarousel({ articles }: VerticalNewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const scrollY = useSharedValue(0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const navigateUp = () => {
    if (currentIndex > 0) {
      pagerRef.current?.setPage(currentIndex - 1);
    }
  };

  const navigateDown = () => {
    if (currentIndex < articles.length - 1) {
      pagerRef.current?.setPage(currentIndex + 1);
    }
  };

  const renderCard = (article: NewsArticle, index: number) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        scrollY.value,
        [(index - 1) * CARD_HEIGHT, index * CARD_HEIGHT, (index + 1) * CARD_HEIGHT],
        [0.9, 1, 0.9],
        Extrapolate.CLAMP
      );

      const opacity = interpolate(
        scrollY.value,
        [(index - 1) * CARD_HEIGHT, index * CARD_HEIGHT, (index + 1) * CARD_HEIGHT],
        [0.5, 1, 0.5],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <Animated.View key={article.id} style={[styles.cardContainer, animatedStyle]}>
        <View style={styles.card}>
          <Image source={{ uri: article.imageUrl }} style={styles.image} />
          <View style={styles.overlay} />
          
          <View style={styles.content}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{article.category.toUpperCase()}</Text>
            </View>
            
            <Text style={styles.headline}>{article.headline}</Text>
            <Text style={styles.description}>{article.description}</Text>
            
            <View style={styles.footer}>
              <Text style={styles.source}>{article.source}</Text>
              <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
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
        onPageSelected={(e) => {
          const newIndex = e.nativeEvent.position;
          setCurrentIndex(newIndex);
          scrollY.value = withSpring(newIndex * CARD_HEIGHT);
        }}
        scrollEnabled={true}
      >
        {articles.map((article, index) => (
          <View key={article.id} style={styles.page}>
            {renderCard(article, index)}
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF0000',
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
    width: SCREEN_WIDTH - 2,
    height: CARD_HEIGHT,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FF0000',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  image: {
    width: '100%',
    height: '40%',
    backgroundColor: '#F3F4F6',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 48, // Increased for a smoother, more elegant curve
    borderTopRightRadius: 48, // Increased for a smoother, more elegant curve
    shadowColor: '#FF0000',
    shadowOffset: {
      width: 0,
      height: -10, // Adjusted to emphasize the curve shadow
    },
    shadowOpacity: 0.2, // Softened for elegance
    shadowRadius: 3, // Reduced for a more refined shadow
    elevation: 3, // Slightly reduced for balance
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: -24,
    marginBottom: 32,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headline: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    lineHeight: 32,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  source: {
    fontSize: 8,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  navigationContainer: {
    position: 'absolute',
    right: 24,
    top: '50%',
    transform: [{ translateY: -60 }],
    alignItems: 'center',
    gap: 12,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  indicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  indicatorText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  progressContainer: {
    position: 'absolute',
    left: 24,
    top: '50%',
    transform: [{ translateY: -40 }],
    gap: 8,
  },
  progressDot: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
  },
});