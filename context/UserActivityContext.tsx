import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define NewsItem interface here to avoid circular deps
export interface NewsItem {
    id: string;
    title: string;
    content: string;
    category: string;
    published_at: string;
    image_url: string | null;
    source?: string;
}

export type UserProfile = {
    name: string;
    bio: string;
    avatar: string | null;
};

interface UserActivityContextType {
    bookmarks: NewsItem[];
    history: NewsItem[];
    userProfile: UserProfile;
    toggleBookmark: (article: NewsItem) => void;
    isBookmarked: (articleId: string) => boolean;
    addToHistory: (article: NewsItem) => void;
    updateProfile: (profile: Partial<UserProfile>) => void;
    clearHistory: () => void;
    clearAllData: () => Promise<void>;
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

export function UserActivityProvider({ children }: { children: React.ReactNode }) {
    const [bookmarks, setBookmarks] = useState<NewsItem[]>([]);
    const [history, setHistory] = useState<NewsItem[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: 'Reader',
        bio: 'News enthusiast',
        avatar: null,
    });

    // Load data on mount
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const savedBookmarks = await AsyncStorage.getItem('user_bookmarks');
            const savedHistory = await AsyncStorage.getItem('user_history');
            const savedProfile = await AsyncStorage.getItem('user_profile');

            if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
            if (savedHistory) setHistory(JSON.parse(savedHistory));
            if (savedProfile) setUserProfile(JSON.parse(savedProfile));
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

    const saveProfile = async (newProfile: UserProfile) => {
        setUserProfile(newProfile);
        await AsyncStorage.setItem('user_profile', JSON.stringify(newProfile));
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

    const updateProfile = (profileUpdates: Partial<UserProfile>) => {
        const newProfile = { ...userProfile, ...profileUpdates };
        saveProfile(newProfile);
    };

    const clearHistory = async () => {
        saveHistory([]);
    };

    const clearAllData = async () => {
        await AsyncStorage.removeItem('user_bookmarks');
        await AsyncStorage.removeItem('user_history');
        await AsyncStorage.removeItem('user_profile');
        setBookmarks([]);
        setHistory([]);
        setUserProfile({
            name: 'Reader',
            bio: 'News enthusiast',
            avatar: null,
        });
    };

    return (
        <UserActivityContext.Provider value={{
            bookmarks,
            history,
            userProfile,
            toggleBookmark,
            addToHistory,
            updateProfile,
            clearHistory,
            isBookmarked,
            clearAllData
        }}>
            {children}
        </UserActivityContext.Provider>
    );
}

export const useUserActivity = () => {
    const context = useContext(UserActivityContext);
    if (!context) {
        throw new Error('useUserActivity must be used within a UserActivityProvider');
    }
    return context;
};
