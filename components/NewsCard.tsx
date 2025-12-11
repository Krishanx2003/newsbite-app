import { useTheme } from '@/context/ThemeContext';
import { useUserActivity } from '@/context/UserActivityContext';
import { NewsItem } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Bookmark, Headphones, Share2, TriangleAlert } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    Extrapolate,
    SharedValue,
    interpolate,
    useAnimatedStyle
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 5;

interface NewsCardProps {
    article: NewsItem;
    index: number;
    activeIndex: SharedValue<number>;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, index, activeIndex }) => {
    const { colors, isDark, fontSize } = useTheme();
    const { toggleBookmark, isBookmarked } = useUserActivity();
    const bookmarked = isBookmarked(article.id);
    const [speaking, setSpeaking] = useState(false);

    const getFontSize = (type: 'headline' | 'body') => {
        const scale = fontSize === 'small' ? 0.85 : fontSize === 'large' ? 1.15 : 1;
        if (type === 'headline') return 24 * scale;
        if (type === 'body') return 15.5 * scale;
        return 14;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Date not available';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleSpeak = async () => {
        const isSpeaking = await Speech.isSpeakingAsync();
        if (isSpeaking) {
            await Speech.stop();
            setSpeaking(false);
        } else {
            setSpeaking(true);
            Speech.speak(`${article.title}. ${article.content}`, {
                onDone: () => setSpeaking(false),
                onStopped: () => setSpeaking(false),
                onError: () => setSpeaking(false),
            });
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${article.title}\n\nRead more on Newsbite app!`,
            });
        } catch (error) {
            console.log(error);
        }
    };

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
                            {/* TTS Button */}
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
                                style={[styles.actionButton, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2' }]}
                            >
                                <TriangleAlert size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
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
