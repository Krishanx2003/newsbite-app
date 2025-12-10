import { useTheme } from '@/context/ThemeContext';
import { useUserActivity } from '@/context/UserActivityContext';
import { Bookmark, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NewsItem {
    id: string;
    title: string;
    content: string;
    category: string;
    published_at: string;
    image_url: string | null;
    source?: string;
}

export function NewsListItem({ article, onPress }: { article: NewsItem; onPress?: () => void }) {
    const { colors } = useTheme();
    const { isBookmarked, toggleBookmark } = useUserActivity();
    const bookmarked = isBookmarked(article.id);

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.contentContainer}>
                {article.image_url && (
                    <Image source={{ uri: article.image_url }} style={styles.image} />
                )}
                <View style={styles.textContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.category}>{article.category.toUpperCase()}</Text>
                        <Text style={[styles.date, { color: colors.muted }]}>{formatDate(article.published_at)}</Text>
                    </View>
                    <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                        {article.title}
                    </Text>
                    <Text style={[styles.source, { color: colors.tint }]}>{article.source || 'Newsbite'}</Text>
                </View>
            </View>
            <View style={[styles.actions, { borderTopColor: colors.border }]}>
                <TouchableOpacity onPress={() => toggleBookmark(article)} style={styles.actionBtn}>
                    <Bookmark size={18} color={bookmarked ? colors.tint : colors.muted} fill={bookmarked ? colors.tint : 'transparent'} />
                </TouchableOpacity>
                <ChevronRight size={18} color={colors.muted} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    contentContainer: {
        flexDirection: 'row',
        padding: 12,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#E5E7EB',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    category: {
        fontSize: 11,
        fontWeight: '700',
        color: '#0EA5E9',
    },
    date: {
        fontSize: 11,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 20,
        marginBottom: 4,
    },
    source: {
        fontSize: 12,
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    actionBtn: {
        padding: 4,
    }
});
