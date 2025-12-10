import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define NewsItem interface here to avoid circular deps or imports if not centralized
export interface NewsItem {
    id: string;
    title: string;
    content: string;
    category: string;
    published_at: string;
    image_url: string | null;
    source?: string;
}

interface UserActivityContextType {
    bookmarks: NewsItem[];
    history: NewsItem[];
    toggleBookmark: (article: NewsItem) => void;
    addToHistory: (article: NewsItem) => void;
    clearHistory: () => void;
    isBookmarked: (id: string) => boolean;
    clearAllData: () => void;
}

const UserActivityContext = createContext<UserActivityContextType>({
    bookmarks: [],
    history: [],
    toggleBookmark: () => { },
    addToHistory: () => { },
    clearHistory: () => { },
    isBookmarked: () => false,
    clearAllData: () => { },
});

export function UserActivityProvider({ children }: { children: React.ReactNode }) {
    const [bookmarks, setBookmarks] = useState<NewsItem[]>([]);
    const [history, setHistory] = useState<NewsItem[]>([]);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const savedBookmarks = await AsyncStorage.getItem('user_bookmarks');
            const savedHistory = await AsyncStorage.getItem('user_history');

            if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
            if (savedHistory) setHistory(JSON.parse(savedHistory));
        } catch (e) {
            console.error('Failed to load user activity', e);
        }
    };

    const saveBookmarks = async (newBookmarks: NewsItem[]) => {
        setBookmarks(newBookmarks);
        await AsyncStorage.setItem('user_bookmarks', JSON.stringify(newBookmarks));
    };

    const saveHistory = async (newHistory: NewsItem[]) => {
        setHistory(newHistory);
        await AsyncStorage.setItem('user_history', JSON.stringify(newHistory));
    };

    const toggleBookmark = (article: NewsItem) => {
        const exists = bookmarks.some(b => b.id === article.id);
        if (exists) {
            saveBookmarks(bookmarks.filter(b => b.id !== article.id));
        } else {
            saveBookmarks([article, ...bookmarks]);
        }
    };

    const isBookmarked = (id: string) => {
        return bookmarks.some(b => b.id === id);
    };

    const addToHistory = (article: NewsItem) => {
        // Avoid duplicates at the top
        const filtered = history.filter(h => h.id !== article.id);
        const newHistory = [article, ...filtered].slice(0, 50); // Keep last 50
        saveHistory(newHistory);
    };

    const clearHistory = async () => {
        saveHistory([]);
    };

    const clearAllData = async () => {
        await AsyncStorage.removeItem('user_bookmarks');
        await AsyncStorage.removeItem('user_history');
        setBookmarks([]);
        setHistory([]);
    };

    return (
        <UserActivityContext.Provider value={{
            bookmarks,
            history,
            toggleBookmark,
            addToHistory,
            clearHistory,
            isBookmarked,
            clearAllData
        }}>
            {children}
        </UserActivityContext.Provider>
    );
}

export const useUserActivity = () => useContext(UserActivityContext);
