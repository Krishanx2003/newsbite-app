import { StorageService } from '@/services/storage.service';
import { NewsItem, UserProfile } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
            // Decryption happens automatically in StorageService
            const savedBookmarks = await StorageService.getItem<NewsItem[]>('user_bookmarks');
            const savedHistory = await StorageService.getItem<NewsItem[]>('user_history');
            const savedProfile = await StorageService.getItem<UserProfile>('user_profile');

            if (savedBookmarks) setBookmarks(savedBookmarks);
            if (savedHistory) setHistory(savedHistory);
            if (savedProfile) setUserProfile(savedProfile);
        } catch (e) {
            console.error('Failed to load user activity', e);
        }
    };

    const saveBookmarks = async (newBookmarks: NewsItem[]) => {
        setBookmarks(newBookmarks);
        // Encryption happens automatically
        await StorageService.setItem('user_bookmarks', newBookmarks);
    };

    const saveHistory = async (newHistory: NewsItem[]) => {
        setHistory(newHistory);
        await StorageService.setItem('user_history', newHistory);
    };

    const saveProfile = async (newProfile: UserProfile) => {
        setUserProfile(newProfile);
        await StorageService.setItem('user_profile', newProfile);
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
        await StorageService.removeItem('user_bookmarks');
        await StorageService.removeItem('user_history');
        await StorageService.removeItem('user_profile');

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
