import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '@/services/auth.service';
import { StorageService } from '@/services/storage.service';
import { Alert } from 'react-native';

interface User {
    id: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSession();
    }, []);

    const loadSession = async () => {
        try {
            const storedToken = await StorageService.getItem<string>('auth_token');
            const storedUser = await StorageService.getItem<User>('user_data');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);
            }
        } catch (e) {
            console.error('Error loading auth session', e);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const data = await AuthService.login(email, password);
            setToken(data.token);
            setUser(data.user);
            await StorageService.setItem('auth_token', data.token);
            await StorageService.setItem('user_data', data.user);
        } catch (e: any) {
            Alert.alert('Login Failed', e.message);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const data = await AuthService.register(email, password);
            setToken(data.token);
            setUser(data.user);
            await StorageService.setItem('auth_token', data.token);
            await StorageService.setItem('user_data', data.user);
        } catch (e: any) {
            Alert.alert('Registration Failed', e.message);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await AuthService.logout();
            setToken(null);
            setUser(null);
        } catch (e) {
            console.error('Logout error', e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoading,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
