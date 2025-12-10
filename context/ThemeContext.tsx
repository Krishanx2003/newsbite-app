import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    colors: typeof Colors.light;
    isDark: boolean;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    toggleTheme: () => { },
    setTheme: () => { },
    colors: Colors.dark,
    isDark: true,
    fontSize: 'medium',
    setFontSize: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemScheme = useColorScheme();
    const [theme, setThemeState] = useState<Theme>('dark');
    const [fontSize, setFontSizeState] = useState<FontSize>('medium');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    useEffect(() => {
        if (isLoaded && !theme) {
            setThemeState(systemScheme === 'dark' ? 'dark' : 'light');
        }
    }, [systemScheme, isLoaded]);

    const loadSettings = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('appTheme');
            const savedFontSize = await AsyncStorage.getItem('appFontSize');

            if (savedTheme === 'light' || savedTheme === 'dark') {
                setThemeState(savedTheme);
            } else {
                setThemeState(systemScheme === 'dark' ? 'dark' : 'light');
            }

            if (savedFontSize === 'small' || savedFontSize === 'medium' || savedFontSize === 'large') {
                setFontSizeState(savedFontSize as FontSize);
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        } finally {
            setIsLoaded(true);
        }
    };

    const setTheme = async (newTheme: Theme) => {
        setThemeState(newTheme);
        try {
            await AsyncStorage.setItem('appTheme', newTheme);
        } catch (error) {
            console.warn('Failed to save theme:', error);
        }
    };

    const setFontSize = async (newSize: FontSize) => {
        setFontSizeState(newSize);
        try {
            await AsyncStorage.setItem('appFontSize', newSize);
        } catch (error) {
            console.warn('Failed to save font size:', error);
        }
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const value = {
        theme,
        toggleTheme,
        setTheme,
        colors: Colors[theme],
        isDark: theme === 'dark',
        fontSize,
        setFontSize,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
