import { useUserActivity } from '@/context/UserActivityContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark, Headphones, Share2, TriangleAlert } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT * 0.78; // Reduced to fit web viewports with headers
const CARD_WIDTH = SCREEN_WIDTH - 5; // Matches native

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
    const { colors, isDark, fontSize } = useTheme();
    const { toggleBookmark, isBookmarked, addToHistory } = useUserActivity();
    const [articles, setArticles] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    const getFontSize = (type: 'headline' | 'body') => {
        const scale = fontSize === 'small' ? 0.85 : fontSize === 'large' ? 1.15 : 1;
        if (type === 'headline') return 24 * scale;
        if (type === 'body') return 15.5 * scale;
        return 14;
    };

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

    const NewsCard = ({ article }: { article: NewsItem }) => {
        const bookmarked = isBookmarked(article.id);
        const [speaking, setSpeaking] = useState(false);

        const handleSpeak = () => {
            if (speaking) {
                window.speechSynthesis.cancel();
                setSpeaking(false);
            } else {
                setSpeaking(true);
                const utterance = new SpeechSynthesisUtterance(`${article.title}. ${article.content}`);
                utterance.onend = () => setSpeaking(false);
                utterance.onerror = () => setSpeaking(false);
                window.speechSynthesis.speak(utterance);
            }
        };

        const handleShare = async () => {
            try {
                if (navigator.share) {
                    await navigator.share({
                        title: article.title,
                        text: `${article.title}\n\nRead more on Newsbite app!`,
                        url: window.location.href, // Or article deep link
                    });
                } else {
                    // Fallback
                    const url = window.location.href;
                    await navigator.clipboard.writeText(`${article.title}\n${url}`);
                    window.alert('Link copied to clipboard!');
                }
            } catch (error) {
                console.log(error);
            }
        };


        return (
            <View style={styles.cardContainer}>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    {article?.image_url && (
                        <>
                            <Image
                                source={{ uri: article.image_url }}
                                style={styles.image as any}
                                resizeMode="cover"
                            />
                            <LinearGradient
                                colors={['transparent', isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)', isDark ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.1)']}
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

                        <Text style={[styles.headline, { color: colors.text, fontSize: getFontSize('headline') }]} numberOfLines={4}>
                            {article.title}
                        </Text>

                        <View style={styles.divider} />

                        <Text style={[styles.description, { color: colors.muted, fontSize: getFontSize('body'), lineHeight: getFontSize('body') * 1.6 }]} numberOfLines={6}>
                            {article.content}
                        </Text>

                        <View style={[styles.footer, { borderColor: colors.border }]}>
                            <View style={styles.footerInfo}>
                                <Text style={styles.source}>Publisher: {article.source || 'Newsbite'}</Text>
                                <Text style={[styles.date, { color: colors.muted }]}>{formatDate(article.published_at)}</Text>
                            </View>

                            <View style={styles.actionsRow}>
                                <TouchableOpacity
                                    onPress={handleSpeak}
                                    style={[styles.actionButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6' }]}
                                >
                                    <Headphones size={20} color={speaking ? colors.tint : colors.muted} />
                                </TouchableOpacity>

                                {/* Bookmark */}
                                <TouchableOpacity
                                    onPress={() => toggleBookmark(article)}
                                    style={[styles.actionButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6' }]}
                                >
                                    <Bookmark size={20} color={bookmarked ? colors.tint : colors.muted} fill={bookmarked ? colors.tint : 'transparent'} />
                                </TouchableOpacity>

                                {/* Share */}
                                <TouchableOpacity
                                    onPress={handleShare}
                                    style={[styles.actionButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6' }]}
                                >
                                    <Share2 size={20} color={colors.muted} />
                                </TouchableOpacity>

                                {/* Report */}
                                <TouchableOpacity
                                    onPress={() => {
                                        window.alert('Thank you. We have received your report and will review this content.');
                                    }}
                                    style={[styles.actionButton, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2' }]}
                                >
                                    <TriangleAlert size={16} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {loading && (
                <View style={styles.loaderContainer}>
                    <Text style={[styles.loaderText, { color: colors.muted }]}>Loading...</Text>
                </View>
            )}

            {!loading && articles.length === 0 && (
                <View style={styles.loaderContainer}>
                    <Text style={[styles.loaderText, { color: colors.muted }]}>No articles found</Text>
                </View>
            )}

            {!loading && articles.length > 0 && (
                <ScrollView
                    style={styles.pager}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                    snapToInterval={window.innerHeight} // Snap to viewport height because pages are 100vh
                    snapToAlignment="center"
                    decelerationRate="fast"
                    onMomentumScrollEnd={(e) => {
                        const index = Math.round(e.nativeEvent.contentOffset.y / e.nativeEvent.layoutMeasurement.height);
                        if (articles[index]) {
                            addToHistory(articles[index]);
                        }
                    }}
                // In web, strictly vertical scrolling
                >
                    {articles.map((article, index) => (
                        <View key={article.id} style={styles.page}>
                            <NewsCard article={article} />
                        </View>
                    ))}
                </ScrollView>
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

    pager: { flex: 1, height: '100%' }, // Explicit height for web scrollview container
    page: {
        // @ts-ignore
        height: '100vh', // Use viewport height for web to ensure full screen snapping
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },

    cardContainer: {
        width: CARD_WIDTH,
        height: '96%', // Leave small gap
        justifyContent: 'center',
    },

    card: {
        flex: 1,
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

    footerInfo: {
        flex: 1,
    },

    date: { fontSize: 13 },
    source: { color: '#0EA5E9', fontSize: 13, fontWeight: '600', marginBottom: 4 },

    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionButton: {
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
