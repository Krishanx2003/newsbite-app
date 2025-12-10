import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase'; // Adjust path as needed
import { Bell, BookOpen, Globe, Search, TrendingUp, Users, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string;
  author_id: string;
  published_at: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  source?: string;
}

interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

const insightsData = [
  {
    id: '1',
    title: 'Climate Action Trends',
    summary: 'Global initiatives show 40% increase in renewable energy adoption',
    icon: 'globe',
    imageUrl: 'https://images.pexels.com/photos/2990650/pexels-photo-2990650.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    title: 'Tech Innovation Report',
    summary: 'AI breakthroughs reshape healthcare and education sectors',
    icon: 'trending',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    title: 'Social Impact Analysis',
    summary: 'Community-driven projects create lasting change worldwide',
    icon: 'users',
    imageUrl: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function SearchScreen() {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState('allnews');
  const [isSearching, setIsSearching] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const searchScale = useSharedValue(1);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    }
  };

  // Fetch news articles
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

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

      const { data, error } = await query;

      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
    fetchNews();
  }, []);

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchCategories(), fetchNews()]);
    setRefreshing(false);
  }, []);

  // Build tabs dynamically from categories
  const tabs = useMemo(() => {
    const baseTabs = [
      { id: 'allnews', title: 'All News' },
    ];

    const categoryTabs = categories.map(cat => ({
      id: cat.name.toLowerCase(),
      title: cat.name,
    }));

    return [...baseTabs, ...categoryTabs];
  }, [categories]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, 500);

    if (searchQuery) {
      setIsSearching(true);
    }

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter articles based on search query and active tab
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Filter by tab/category
    if (activeTab !== 'allnews') {
      filtered = filtered.filter(article =>
        article.category?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Filter by search query
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      filtered = filtered.filter(
        article =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [articles, debouncedQuery, activeTab]);

  // Highlight matching keywords
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <Text key={index} style={[styles.highlightedText, { backgroundColor: isDark ? '#78350F' : '#FEF3C7', color: isDark ? '#FEF3C7' : '#92400E' }]}>
            {part}
          </Text>
        );
      }
      return part;
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    // Show full date for compliance (required by Google Play)
    if (diffInHours < 24) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const handleSearchPress = () => {
    searchScale.value = withSpring(0.95, {}, () => {
      searchScale.value = withSpring(1);
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    Keyboard.dismiss();
  };

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchScale.value }],
  }));

  const renderInsightCard = ({ item, index }: { item: any; index: number }) => {
    const getIcon = (iconName: string) => {
      switch (iconName) {
        case 'globe':
          return <Globe size={20} color={colors.tint} />;
        case 'trending':
          return <TrendingUp size={20} color={colors.tint} />;
        case 'users':
          return <Users size={20} color={colors.tint} />;
        default:
          return <BookOpen size={20} color={colors.tint} />;
      }
    };

    return (
      <Animated.View
        entering={FadeIn.delay(index * 100).springify()}
        style={[styles.insightCard, { backgroundColor: colors.card }]}
      >
        <TouchableOpacity activeOpacity={0.7}>
          <Image source={{ uri: item.imageUrl }} style={[styles.insightImage, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]} />
          <View style={styles.insightContent}>
            <View style={styles.insightHeader}>
              {getIcon(item.icon)}
              <Text style={[styles.insightTitle, { color: colors.text }]} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
            <Text style={[styles.insightSummary, { color: colors.muted }]} numberOfLines={2}>
              {item.summary}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderNewsCard = ({ item, index }: { item: NewsArticle; index: number }) => {
    // Extract first 150 characters as description
    const description = item.content.substring(0, 150) + '...';

    return (
      <Animated.View
        entering={FadeIn.delay(index * 100).springify()}
        exiting={FadeOut}
      >
        <TouchableOpacity
          style={[styles.newsCard, { backgroundColor: colors.card }]}
          activeOpacity={0.7}
          onPress={() => {
            // Navigate to article details or open in browser
          }}
        >
          {item.image_url && (
            <Image
              source={{ uri: item.image_url }}
              style={[styles.newsThumbnail, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}

            />
          )}
          <View style={styles.newsContent}>
            {item.category && (
              <View style={[styles.categoryBadge, { backgroundColor: isDark ? 'rgba(14,165,233,0.1)' : '#EFF6FF' }]}>
                <Text style={[styles.categoryText, { color: colors.tint }]}>{item.category.toUpperCase()}</Text>
              </View>
            )}
            <Text style={[styles.newsTitle, { color: colors.text }]} numberOfLines={2}>
              {debouncedQuery ? highlightText(item.title, debouncedQuery) : item.title}
            </Text>
            <Text style={[styles.newsDescription, { color: colors.muted }]} numberOfLines={2}>
              {debouncedQuery ? highlightText(description, debouncedQuery) : description}
            </Text>
            <View style={styles.newsFooter}>
              <View style={styles.newsFooterLeft}>
                <Text style={[styles.newsSource, { color: colors.tint }]}>
                  Publisher: {item.source || 'Newsbite'}
                </Text>
                <Text style={[styles.newsDate, { color: colors.muted }]}>
                  {formatDate(item.published_at || item.created_at)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeIn.delay(300)}
      style={styles.emptyState}
    >
      <Search size={64} color={colors.muted} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No results found</Text>
      <Text style={[styles.emptyDescription, { color: colors.muted }]}>
        Try searching with different keywords or check your spelling
      </Text>
    </Animated.View>
  );

  const renderErrorState = () => (
    <Animated.View
      entering={FadeIn.delay(300)}
      style={styles.emptyState}
    >
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Something went wrong</Text>
      <Text style={[styles.emptyDescription, { color: colors.muted }]}>{error}</Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: colors.tint }]}
        onPress={onRefresh}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.loadingText, { color: colors.muted }]}>Loading news...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      {/* Sticky Header */}
      <View style={[styles.stickyHeader, { backgroundColor: colors.background }]}>
        {/* Search Bar */}
        <Animated.View style={[styles.searchContainer, searchBarAnimatedStyle, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={handleSearchPress} style={styles.searchIconContainer}>
            <Search size={20} color={colors.muted} />
          </TouchableOpacity>

          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search news, topics…"
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          {searchQuery.length > 0 && (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <X size={20} color={colors.muted} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>

        {/* Tab Menu */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                { backgroundColor: colors.card },
                activeTab === tab.id && { backgroundColor: colors.tint }
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: colors.muted },
                  activeTab === tab.id && styles.activeTabText
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Notifications */}
        {/* Commenting out notification for some time, enable afterwards */}
        {/* <View style={styles.notificationContainer}>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color="#6B7280" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.notificationText}>You have 3 unread notifications</Text>
        </View> */}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
        }
      >
        {/* News Results */}
        <View style={styles.newsSection}>
          {error ? (
            renderErrorState()
          ) : filteredArticles.length > 0 ? (
            <FlatList
              data={filteredArticles}
              renderItem={renderNewsCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.newsList}
            />
          ) : (
            !isSearching && renderEmptyState()
          )}

          {isSearching && (
            <Animated.View entering={FadeIn} style={styles.loadingState}>
              <Text style={[styles.loadingText, { color: colors.muted }]}>Searching...</Text>
            </Animated.View>
          )}
        </View>

        {/* Insights Section */}
        {!searchQuery && (
          <View style={styles.insightsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Insights for You</Text>
            <FlatList
              data={insightsData}
              renderItem={renderInsightCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.insightsList}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: handled by dynamic theme
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyHeader: {
    // backgroundColor: handled by dynamic theme
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: handled by dynamic theme
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIconContainer: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    // color: handled by dynamic theme
  },
  clearButton: {
    marginLeft: 12,
    padding: 4,
  },
  tabContainer: {
    paddingBottom: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    // backgroundColor: handled by dynamic theme
    marginRight: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activeTab: {
    // backgroundColor: handled by dynamic theme
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    // color: handled by dynamic theme
  },
  activeTabText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
  },
  newsSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  newsList: {
    paddingBottom: 16,
  },
  newsCard: {
    // backgroundColor: handled by dynamic theme
    borderRadius: 16,
    marginBottom: 16,
    padding: 12,
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  newsThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    // backgroundColor: handled by dynamic theme
  },
  newsContent: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    // backgroundColor: handled by dynamic theme
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    // color: handled by dynamic theme
    letterSpacing: 0.5,
  },
  newsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    // color: handled by dynamic theme
    lineHeight: 20,
    marginBottom: 6,
  },
  newsDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    // color: handled by dynamic theme
    lineHeight: 18,
    marginBottom: 8,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  newsFooterLeft: {
    flex: 1,
  },
  newsSource: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    // color: handled by dynamic theme
  },
  newsDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    // color: handled by dynamic theme
  },
  highlightedText: {
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    // color: handled by dynamic theme
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    // color: handled by dynamic theme
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    // color: handled by dynamic theme
    marginTop: 8,
  },
  retryButton: {
    marginTop: 16,
    // backgroundColor: handled by dynamic theme
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  insightsSection: {
    paddingTop: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    // color: handled by dynamic theme
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  insightsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  insightCard: {
    // backgroundColor: handled by dynamic theme
    borderRadius: 16,
    width: 280,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  insightImage: {
    width: '100%',
    height: 120,
    // backgroundColor: handled by dynamic theme
  },
  insightContent: {
    padding: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    // color: handled by dynamic theme
    flex: 1,
  },
  insightSummary: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    // color: handled by dynamic theme
    lineHeight: 20,
  },
});