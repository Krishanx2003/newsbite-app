import { NewsListItem } from '@/components/NewsListItem';
import { useTheme } from '@/context/ThemeContext';
import { useUserActivity } from '@/context/UserActivityContext';
import { router } from 'expo-router';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const { colors } = useTheme();
    const { history, clearHistory } = useUserActivity();

    const handleClearHistory = () => {
        if (history.length === 0) return;

        Alert.alert(
            'Clear History',
            'Are you sure you want to clear your reading history?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: clearHistory
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Reading History</Text>
                <TouchableOpacity onPress={handleClearHistory} disabled={history.length === 0}>
                    <Trash2 size={20} color={history.length > 0 ? '#EF4444' : colors.muted} />
                </TouchableOpacity>
            </View>

            {history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.muted }]}>No history yet.</Text>
                    <Text style={[styles.emptySubtext, { color: colors.muted }]}>
                        Articles you read will appear here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    renderItem={({ item }) => (
                        <NewsListItem article={item} onPress={() => { }} />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: { padding: 4 },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    listContent: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});
